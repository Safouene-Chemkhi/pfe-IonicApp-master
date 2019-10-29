import pickle
import pandas as pd
import numpy as np
from keras.models import Sequential
from keras.layers import Conv2D
from keras.layers import MaxPooling2D
from keras.layers import Flatten
from keras.layers import Dense
from keras.layers import Dropout
from sklearn.preprocessing import LabelBinarizer, LabelEncoder
from flask import Flask, flash, request, redirect, url_for, send_from_directory
from flask_cors import CORS, cross_origin
import tensorflow as tf
import json
import matplotlib.pyplot as plt
from bson import ObjectId
from flask_pymongo import PyMongo
import datetime

app = Flask(__name__)
cors = CORS()
app.config["MONGO_URI"] = "mongodb://localhost:27017/activityDetector"
mongo = PyMongo(app)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


# The window function
def window(data_set, size):
    start = 0
    while start < data_set.count():
        yield int(start), int(start + size)
        start += size


def prepare_data(data):
    AccX = data.loc['4145', :]
    AccY = data.loc['4146', :]
    AccZ = data.loc['4147', :]

    Ax = np.empty(AccX.size)
    Ay = np.empty(AccY.size)
    Az = np.empty(AccZ.size)

    for i in range(AccX.size):
        Ax[i] = AccX[i][1]
        Ay[i] = AccY[i][1]
        Az[i] = AccZ[i][1]
    data_set = pd.DataFrame({"AccX": Ax,
                             "AccY": Ay,
                             "AccZ": Az})
    return data_set


# Segmenting the data_set for acceleration
def segment_acc_data(data_set, window_size):
    segments = np.empty((0, window_size, 8))
    zeropadding = pd.Series(np.zeros((64)))
    # print(size)
    for (start, end) in window(data_set['AccX'], window_size):
        x = data_set["AccX"][start:end]
        y = data_set["AccY"][start:end]
        z = data_set["AccZ"][start:end]
        if (len(data_set['AccX'][start:end]) == window_size):
            segments = np.vstack([segments, np.dstack([y, zeropadding, z, zeropadding, x, y, z, x])])
    return segments


def make_cnn(window_size, n_channels, n_layers, filter_size, filter_nbr, pool_size, n_classes, dropout):
    # Installing the CNN
    classifier = Sequential()
    # Step 1 - Adding the first convolution layer
    classifier.add(
        Conv2D(filters=filter_nbr, kernel_size=filter_size, input_shape=(window_size, n_channels, 1),
               activation="relu"))
    # classifier.add(MaxPooling2D(pool_size=pool_size))
    for i in range(1, n_layers):
        classifier.add(Conv2D(filters=filter_nbr, kernel_size=filter_size, activation="relu", padding='same'))
        classifier.add(MaxPooling2D(pool_size=pool_size))
    # Step 2 - Maxpooling
    classifier.add(Dropout(dropout))
    # Step 3 - Flattening
    classifier.add(Flatten())
    # Full connection
    classifier.add(Dense(activation='relu', units=1024))
    classifier.add(Dense(activation='relu', units=128))
    classifier.add(Dense(activation='softmax', units=n_classes))
    # print(classifier.summary())
    # Compiling the CNN
    classifier.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    # Loading CNN weights
    classifier.load_weights('weights/HAR_classifier_Conv2D_LOSO.weights')
    graph = tf.get_default_graph()
    with open('weights/labelencoder.pickle', 'rb') as f:
        labelencoder = pickle.load(f)
    with open('weights/labelbinarizer.pickle', 'rb') as f:
        labelbinarizer = pickle.load(f)
    print("Loading model done ...")
    return classifier, labelencoder, labelbinarizer, graph


window_size = 64
n_channels = 8
n_layers = 4
filter_size = (5, 2)
filter_nbr = 32
pool_size = (3, 1)
n_classes = 10
dropout = 0.1
classifier, labelencoder, labelbinarizer, graph = make_cnn(window_size, n_channels, n_layers, filter_size, filter_nbr,
                                                           pool_size, n_classes, dropout)


@app.route('/', methods=['POST', 'GET'])
def get_classes():
    print('receiving request...')
    data_json = request.get_json()
    print(request.get_json())
    data = pd.DataFrame.from_dict(data_json, orient='index')
    data = prepare_data(data)

    segments = segment_acc_data(data, window_size)
    segments = segments.reshape(segments.shape[0], segments.shape[1], segments.shape[2], 1)
    print(segments.shape)
    with graph.as_default():
        classifier._make_predict_function()
        y_pred_b = classifier.predict(segments)
    y_pred_e = labelbinarizer.inverse_transform(y_pred_b)
    res = np.ones(64) * y_pred_e[0]
    for i in range(1, y_pred_e.size):
        temp = np.ones(64) * y_pred_e[i]
        res = np.append(res, temp)
    res = res.astype(np.int64)
    print(labelencoder.classes_)
    y_pred = labelencoder.inverse_transform(res)
    # plt.plot(y_pred)
    # plt.show()
    print(json.dumps(y_pred.tolist(), ensure_ascii=False))
    return json.dumps(y_pred.tolist(), ensure_ascii=False)
    return "success"


@app.route("/medecin/<code>")
def user_profile(code):
    print('receiving request...')
    medecin = mongo.db.medecins.find_one_or_404({"code": code})
    return JSONEncoder().encode(medecin)


@app.route("/code/<patient>/<code>")
def user_profile2(patient, code):
    print('receiving request...')

    exist = mongo.db.patients.find_one({"email": patient})
    # exist= False;
    print(exist["medecin"]["code"])
    if code in exist["medecin"]["code"]:
        return "success"
    else:
        return "failed"


@app.route("/report", methods=['POST'])
def post_report():
    print('receiving request...')
    data_json = request.get_json()
    print(request.get_json())

    email = data_json["email"]
    report = data_json["report"]

    # post = {"author": "Mike",
    #         "text": "My first blog report!",
    #         "date": datetime.datetime.utcnow(),
    #         "record": 2132,
    #         "record_duration": "10s",
    #         "record_date":"10/05/55"}

    posts = mongo.db.patients
    posts.update_one({"email": email},{"$push": {'report': report}},)
    return "success"

@app.route("/patient/<patient>", methods=['GET'])
def get_patient(patient):
    print('receiving request...')
    patient = mongo.db.patients.find_one_or_404({"email": patient})
    return JSONEncoder().encode(patient)


if __name__ == "__main__":
    # app.run()
    app.run(host='0.0.0.0')

# data kima hakka ab3athha bel postman
# a = {
# 	"AccX" : ["1","2","2","2","1","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2"],
# 	"AccY" : ["1","2","2","2","1","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2"],
# 	"AccZ" : ["1","2","2","2","1","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2"]
# }


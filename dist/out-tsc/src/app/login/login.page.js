import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { TranslateConfigService } from '../translate-config.service';
var responseParameters;
var LoginPage = /** @class */ (function () {
    function LoginPage(router, translateConfigService, loadingController, httpNative) {
        this.router = router;
        this.translateConfigService = translateConfigService;
        this.loadingController = loadingController;
        this.httpNative = httpNative;
        this.options = {
            location: 'yes',
            hidden: 'no',
            clearcache: 'yes',
            clearsessioncache: 'yes',
            zoom: 'yes',
            hardwareback: 'yes',
            mediaPlaybackRequiresUserAction: 'no',
            shouldPauseOnSuspend: 'no',
            closebuttoncaption: 'Close',
            disallowoverscroll: 'no',
            toolbar: 'yes',
            enableViewportScale: 'no',
            allowInlineMediaPlayback: 'no',
            presentationstyle: 'pagesheet',
            fullscreen: 'yes',
        };
        this.loading_message = 'Downloading User Data..';
        var lang = localStorage.getItem('lang');
        if (lang) {
            this.selectedLanguage = (lang == 'fr');
            this.translateConfigService.setLanguage(lang == 'fr');
            if (lang == 'fr') {
                this.loading_message = 'Téléchargement des données en cours..';
            }
        }
        else {
            this.selectedLanguage = false;
            this.translateConfigService.setLanguage(false);
        }
    }
    LoginPage.prototype.ngOnInit = function () {
        var _this = this;
        var refresh_token = localStorage.getItem("_refrech_token");
        setTimeout(function () {
            /*        if(refresh_token){
                        this.presentLoading();
                        this.get_token_refresh(refresh_token)
                    }
                    else{*/
            _this.get_auth_code().then(function (value) {
                //localStorage.setItem("_token", value);
                _this.presentLoading();
                _this.get_token(value);
            }, function (error) {
                console.error(error);
            });
            //  console.log("storage code:");
            // console.log(localStorage.getItem("code"));
            console.log("storage token:");
            console.log(localStorage.getItem("_token"));
            // }
        }, 4000);
    };
    LoginPage.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: this.loading_message,
                            duration: 20000,
                            spinner: "crescent"
                        })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        console.log('Loading dismissed!');
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.get_auth_code = function () {
        return new Promise(function (resolve, reject) {
            var browserRef = window.cordova.InAppBrowser.open("https://api.hexoskin.com/api/connect/oauth2/auth/?scope=readwrite&state=3991737&redirect_uri=https://app.getpostman.com/oauth2/callback&response_type=code&client_id=aI4mbAzOvxNVO6exipoK7KMShi4lsD", "_self", "location=no,clearsessioncache=yes,clearcache=yes");
            browserRef.addEventListener("exit", function (event) {
                reject("The Application sign in flow was canceled");
            });
            browserRef.addEventListener("loadstart", function (event) {
                console.log('listen event oauth callback');
                console.log(event.url);
                if ((event.url).indexOf("https://app.getpostman.com/oauth2/callback") === 0) {
                    browserRef.removeEventListener("exit", function (event) { });
                    console.log(event.url);
                    responseParameters = ((event.url).split("?")[1]).split("&");
                    // console.log(responseParameters);
                    var parsedResponse = {};
                    for (var i = 0; i < responseParameters.length; i++) {
                        parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                    }
                    if (parsedResponse["code"] !== undefined && parsedResponse["code"] !== null) {
                        resolve(parsedResponse["code"]);
                    }
                    else {
                        reject("Problem authenticating with Activity Detector");
                    }
                    browserRef.close();
                }
            });
        });
    };
    LoginPage.prototype.get_token_refresh = function (refresh_token) {
        var _this = this;
        var json = { "grant_type": "refresh_token", "refresh_token": refresh_token };
        this.httpNative.post('https://api.hexoskin.com/api/connect/oauth2/token/', json, { "Authorization": "Basic YUk0bWJBek92eE5WTzZleGlwb0s3S01TaGk0bHNEOnRubXhRYnB6SDhFblVwVnZKU0pTUDJQVUtWZVpGVQ==", "Content-Type": "application/json" })
            .then(function (res) {
            _this.token_json = JSON.parse(res.data).access_token;
            console.log("hexoskin token: ");
            console.log(_this.token_json);
            localStorage.setItem("_token", _this.token_json);
            //this.access_token = this.token_json;
            //this.get_record_list(this.token_json)
            _this.loadingController.dismiss();
            _this.router.navigateByUrl('/profile');
        }, function (err) {
            console.error(err.status);
            console.error(err);
        });
    };
    LoginPage.prototype.get_token = function (code) {
        var _this = this;
        var json = { "grant_type": "authorization_code", "code": code, "redirect_uri": "https://app.getpostman.com/oauth2/callback" };
        this.httpNative.post('https://api.hexoskin.com/api/connect/oauth2/token/', json, { "Authorization": "Basic YUk0bWJBek92eE5WTzZleGlwb0s3S01TaGk0bHNEOnRubXhRYnB6SDhFblVwVnZKU0pTUDJQVUtWZVpGVQ==", "Content-Type": "application/json" })
            .then(function (res) {
            _this.token_json = JSON.parse(res.data).access_token;
            localStorage.setItem("_refrech_token", JSON.parse(res.data).refresh_token);
            console.log("hexoskin token: ");
            console.log(_this.token_json);
            localStorage.setItem("_token", _this.token_json);
            //this.access_token = this.token_json;
            //this.get_record_list(this.token_json)
            _this.loadingController.dismiss();
            _this.router.navigateByUrl('/profile');
        }, function (err) {
            // console.error(err.status);
            console.error(err);
        });
    };
    LoginPage = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.page.html',
            styleUrls: ['./login.page.scss'],
            providers: [HTTP]
        }),
        tslib_1.__metadata("design:paramtypes", [Router, TranslateConfigService, LoadingController, HTTP])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.page.js.map
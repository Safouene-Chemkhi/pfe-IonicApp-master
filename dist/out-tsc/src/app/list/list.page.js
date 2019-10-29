import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateConfigService } from '../translate-config.service';
var ListPage = /** @class */ (function () {
    function ListPage(alertController, httpNative, router, loadingController, translateConfigService) {
        this.alertController = alertController;
        this.httpNative = httpNative;
        this.router = router;
        this.loadingController = loadingController;
        this.translateConfigService = translateConfigService;
        this.count = 0;
        this.loading_message = 'Fetching data..';
        this.alert_message = 'Select now another record to compare with!';
        this.header = 'Next record';
        this.isCheckboxDisabled = [];
        var lang = localStorage.getItem('lang');
        if (lang) {
            this.selectedLanguage = (lang == 'fr');
            this.translateConfigService.setLanguage(lang == 'fr');
            if (lang == 'fr') {
                this.alert_message = 'Selectionnez un deuxième enregistrement pour faire la comparaison!';
                this.loading_message = 'Téléchargement des données..';
                this.header = "Enregistrement suivant";
            }
        }
        else {
            this.selectedLanguage = false;
            this.translateConfigService.setLanguage(false);
        }
    }
    ListPage.prototype.languageChanged = function () {
        console.log('language changed');
        this.translateConfigService.setLanguage(this.selectedLanguage);
        if (this.selectedLanguage == true) {
            localStorage.setItem('lang', 'fr');
            this.alert_message = 'Selectionnez un deuxième enregistrement!';
            this.loading_message = 'Téléchargement..';
            this.header = "Enregistrement suivant";
        }
        else {
            localStorage.setItem('lang', 'en');
            this.alert_message = 'Select now another record to compare with!';
            this.loading_message = 'Fetching data..';
            this.header = 'Next record';
        }
    };
    ListPage.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: this.loading_message,
                            duration: 20000,
                            translucent: true
                        })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListPage.prototype.presentAlert = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: this.header,
                            message: this.alert_message,
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListPage.prototype.onClick = function (id, index) {
        if (this.count == 0) {
            this.count = this.count + 1;
            this.id1 = id;
            this.presentAlert();
            this.isCheckboxDisabled[index] = true;
            this.index1 = index;
        }
        else {
            this.isCheckboxDisabled[index] = true;
            this.count = this.count - 1;
            console.log('Going to data_charts ...');
            this.router.navigate(['/home/', { id1: this.id1, date1: this.records[this.index1]["start_date"], duration1: this.records[this.index1]["duration"], id2: id, date2: this.records[index]["start_date"] }]);
        }
    };
    ListPage.prototype.get_record_list = function (token) {
        var _this = this;
        console.log("requesting record list ...");
        this.httpNative.get('https://api.hexoskin.com/api/record/?limit=999', {}, { "Authorization": "Bearer " + token, "Content-Type": "application/json" }).then(function (list) {
            _this.records = JSON.parse(list.data)["objects"];
            for (var index = 0; index < JSON.parse(list.data)["objects"].length; index++) {
                _this.isCheckboxDisabled.push(false);
            }
            console.log(JSON.stringify(_this.records));
            _this.loadingController.dismiss();
        }, function (err) {
            console.error(JSON.stringify(err));
        });
    };
    ListPage.prototype.ionViewWillEnter = function () {
        if (this.isCheckboxDisabled) {
            for (var index = 0; index < this.isCheckboxDisabled.length; index++) {
                this.isCheckboxDisabled[index] = false;
            }
        }
    };
    ListPage.prototype.ngOnInit = function () {
        this.presentLoading();
        var token = localStorage.getItem("_token");
        this.get_record_list(token);
    };
    ListPage = tslib_1.__decorate([
        Component({
            selector: 'app-list',
            templateUrl: 'list.page.html',
            styleUrls: ['list.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController, HTTP, Router, LoadingController, TranslateConfigService])
    ], ListPage);
    return ListPage;
}());
export { ListPage };
//# sourceMappingURL=list.page.js.map
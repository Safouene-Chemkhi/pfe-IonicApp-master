import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { TranslateConfigService } from '../translate-config.service';
var ProfilePage = /** @class */ (function () {
    function ProfilePage(loadingController, httpNative, translateConfigService) {
        this.loadingController = loadingController;
        this.httpNative = httpNative;
        this.translateConfigService = translateConfigService;
        var lang = localStorage.getItem('lang');
        if (lang) {
            this.selectedLanguage = (lang == 'fr');
            this.translateConfigService.setLanguage(lang == 'fr');
        }
        else {
            this.selectedLanguage = false;
            this.translateConfigService.setLanguage(false);
        }
    }
    ProfilePage.prototype.languageChanged = function () {
        console.log('language changed');
        this.translateConfigService.setLanguage(this.selectedLanguage);
        if (this.selectedLanguage == true) {
            localStorage.setItem('lang', 'fr');
        }
        else {
            localStorage.setItem('lang', 'en');
        }
    };
    ProfilePage.prototype.ngOnInit = function () {
        //this.presentLoading() 
        var token = localStorage.getItem("_token");
        this.get_user_profile(token);
    };
    ProfilePage.prototype.get_user_profile = function (token) {
        var _this = this;
        console.log("requesting record list ...");
        this.httpNative.get('https://api.hexoskin.com/api/account/', {}, { "Authorization": "Bearer " + token, "Content-Type": "application/json" }).then(function (list) {
            _this.data = JSON.parse(list.data)["objects"][0];
            console.log(JSON.stringify(_this.data));
            //this.loadingController.dismiss();
        }, function (err) {
            console.error(JSON.stringify(err));
        });
    };
    ProfilePage.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: 'Fetching user info ...',
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
    ProfilePage = tslib_1.__decorate([
        Component({
            selector: 'app-profile',
            templateUrl: './profile.page.html',
            styleUrls: ['./profile.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [LoadingController, HTTP, TranslateConfigService])
    ], ProfilePage);
    return ProfilePage;
}());
export { ProfilePage };
//# sourceMappingURL=profile.page.js.map
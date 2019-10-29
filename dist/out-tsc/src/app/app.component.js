import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreenPage } from './splash-screen/splash-screen.page';
import { TranslateConfigService } from './translate-config.service';
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar, modalCtrl, translateConfigService) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.modalCtrl = modalCtrl;
        this.translateConfigService = translateConfigService;
        this.appPages = [
            {
                title: 'MENU.1',
                url: '/profile',
                icon: 'assets/icon/profil.png'
            },
            {
                title: 'MENU.2',
                url: '/list',
                icon: 'assets/icon/records.png'
            },
            {
                title: 'MENU.3',
                url: '/reports',
                icon: 'assets/icon/reports.png'
            },
            {
                title: 'MENU.4',
                url: '/logout',
                icon: 'assets/icon/logout.png'
            }
        ];
        this.params = {
            "background": "assets/images/background/back.jpg",
            "image": "assets/icon/logo2.png",
            "title": "Activity Detector"
        };
        this.initializeApp();
    }
    AppComponent.prototype.menuOpened = function () {
        console.log('menu opened ...');
        var lang = localStorage.getItem('lang');
        if (lang) {
            this.selectedLanguage = (lang == 'fr');
            this.translateConfigService.setLanguage(lang == 'fr');
        }
        else {
            this.selectedLanguage = false;
            this.translateConfigService.setLanguage(false);
        }
    };
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.statusBar.styleDefault();
                //this.splashScreen.hide();
                this.presentModal();
                return [2 /*return*/];
            });
        }); });
    };
    AppComponent.prototype.presentModal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: SplashScreenPage,
                            componentProps: { value: 123 },
                            cssClass: "modal-fullscreen"
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar,
            ModalController,
            TranslateConfigService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map
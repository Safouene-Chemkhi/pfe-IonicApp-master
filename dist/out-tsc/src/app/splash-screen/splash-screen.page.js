import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ModalController } from '@ionic/angular';
var SplashScreenPage = /** @class */ (function () {
    function SplashScreenPage(modalCtrl, splashScreen) {
        this.modalCtrl = modalCtrl;
        this.splashScreen = splashScreen;
        console.log("splashscree");
    }
    SplashScreenPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.splashScreen.hide();
        setTimeout(function () {
            _this.modalCtrl.dismiss();
        }, 4000);
    };
    SplashScreenPage.prototype.ngOnInit = function () {
    };
    SplashScreenPage = tslib_1.__decorate([
        Component({
            selector: 'app-splash-screen',
            templateUrl: './splash-screen.page.html',
            styleUrls: ['./splash-screen.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController, SplashScreen])
    ], SplashScreenPage);
    return SplashScreenPage;
}());
export { SplashScreenPage };
//# sourceMappingURL=splash-screen.page.js.map
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
var LoadingPage = /** @class */ (function () {
    function LoadingPage(modalCtrl) {
        this.modalCtrl = modalCtrl;
        console.log("loading user data");
    }
    LoadingPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        setTimeout(function () {
            _this.modalCtrl.dismiss();
        }, 4000);
    };
    LoadingPage.prototype.ngOnInit = function () {
    };
    LoadingPage = tslib_1.__decorate([
        Component({
            selector: 'app-loading',
            templateUrl: './loading.page.html',
            styleUrls: ['./loading.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController])
    ], LoadingPage);
    return LoadingPage;
}());
export { LoadingPage };
//# sourceMappingURL=loading.page.js.map
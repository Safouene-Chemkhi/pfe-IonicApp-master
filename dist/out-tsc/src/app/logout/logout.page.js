import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
var LogoutPage = /** @class */ (function () {
    function LogoutPage(router) {
        this.router = router;
    }
    LogoutPage.prototype.ngOnInit = function () {
    };
    LogoutPage.prototype.ionViewWillEnter = function () {
        localStorage.clear();
        this.router.navigateByUrl('/login');
    };
    LogoutPage = tslib_1.__decorate([
        Component({
            selector: 'app-logout',
            templateUrl: './logout.page.html',
            styleUrls: ['./logout.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router])
    ], LogoutPage);
    return LogoutPage;
}());
export { LogoutPage };
//# sourceMappingURL=logout.page.js.map
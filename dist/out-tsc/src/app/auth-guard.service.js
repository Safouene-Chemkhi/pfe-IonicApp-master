import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
var AuthGuardService = /** @class */ (function () {
    function AuthGuardService(nav) {
        this.nav = nav;
    }
    AuthGuardService.prototype.canActivate = function (route) {
        console.log(route);
        var authInfo = {
            authenticated: localStorage.getItem('_token')
        };
        if (!authInfo.authenticated) {
            this.nav.navigateRoot('login');
            return false;
        }
        return true;
    };
    AuthGuardService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [NavController])
    ], AuthGuardService);
    return AuthGuardService;
}());
export { AuthGuardService };
//# sourceMappingURL=auth-guard.service.js.map
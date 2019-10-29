import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SplashScreenPage } from './splash-screen.page';
var routes = [
    {
        path: '',
        component: SplashScreenPage
    }
];
var SplashScreenPageModule = /** @class */ (function () {
    function SplashScreenPageModule() {
    }
    SplashScreenPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [SplashScreenPage]
        })
    ], SplashScreenPageModule);
    return SplashScreenPageModule;
}());
export { SplashScreenPageModule };
//# sourceMappingURL=splash-screen.module.js.map
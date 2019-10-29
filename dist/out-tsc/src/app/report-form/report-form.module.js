import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReportFormPage } from './report-form.page';
var routes = [
    {
        path: '',
        component: ReportFormPage
    }
];
var ReportFormPageModule = /** @class */ (function () {
    function ReportFormPageModule() {
    }
    ReportFormPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ReportFormPage]
        })
    ], ReportFormPageModule);
    return ReportFormPageModule;
}());
export { ReportFormPageModule };
//# sourceMappingURL=report-form.module.js.map
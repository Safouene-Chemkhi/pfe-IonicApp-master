import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
var ReportFormPage = /** @class */ (function () {
    function ReportFormPage() {
    }
    ReportFormPage.prototype.ngOnInit = function () {
    };
    ReportFormPage.prototype.onEvent = function (event, e) {
        if (e) {
            e.stopPropagation();
        }
        if (this.events[event]) {
            this.events[event](this.getItemData());
            this.resetValue();
        }
    };
    ReportFormPage.prototype.getItemData = function () {
        return {
            'name': this.name,
            'title': this.title,
            'description': this.description
        };
    };
    ReportFormPage.prototype.resetValue = function () {
        this.name = "";
        this.title = "";
        this.description = "";
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ReportFormPage.prototype, "data", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ReportFormPage.prototype, "events", void 0);
    ReportFormPage = tslib_1.__decorate([
        Component({
            selector: 'app-report-form',
            templateUrl: './report-form.page.html',
            styleUrls: ['./report-form.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ReportFormPage);
    return ReportFormPage;
}());
export { ReportFormPage };
//# sourceMappingURL=report-form.page.js.map
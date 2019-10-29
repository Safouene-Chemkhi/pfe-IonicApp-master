import * as tslib_1 from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { Content } from '@angular/compiler/src/render3/r3_ast';
var ReportsPage = /** @class */ (function () {
    function ReportsPage() {
        this.slider = {};
    }
    ReportsPage.prototype.ngOnInit = function () {
    };
    ReportsPage.prototype.slideHasChanged = function (slider, index) {
        this.slider[index] = slider;
        if (2 == slider._activeIndex) {
            if (this.data.items) {
                this.data.items.splice(index, 1);
            }
            else {
                this.data.splice(index, 1);
            }
        }
    };
    ReportsPage.prototype.onClickEvent = function (index) {
        if (this.slider[index]) {
            this.slider[index].slidePrev(300);
        }
    };
    ReportsPage.prototype.onEvent = function (event, item, e) {
        if (e) {
            e.stopPropagation();
        }
        if (this.events[event]) {
            this.events[event](item);
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ReportsPage.prototype, "data", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ReportsPage.prototype, "events", void 0);
    tslib_1.__decorate([
        ViewChild(Content),
        tslib_1.__metadata("design:type", Content)
    ], ReportsPage.prototype, "content", void 0);
    ReportsPage = tslib_1.__decorate([
        Component({
            selector: 'app-reports',
            templateUrl: './reports.page.html',
            styleUrls: ['./reports.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ReportsPage);
    return ReportsPage;
}());
export { ReportsPage };
//# sourceMappingURL=reports.page.js.map
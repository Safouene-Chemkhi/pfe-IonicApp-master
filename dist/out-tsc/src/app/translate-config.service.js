import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
var TranslateConfigService = /** @class */ (function () {
    function TranslateConfigService(translate) {
        this.translate = translate;
        this.translate.use('en');
    }
    TranslateConfigService.prototype.getDefaultLanguage = function () {
        //let language = this.translate.getBrowserLang();
        this.translate.setDefaultLang('en');
        return 'en';
    };
    TranslateConfigService.prototype.setLanguage = function (setLang) {
        if (setLang == true) {
            this.translate.use('fr');
        }
        else {
            this.translate.use('en');
        }
    };
    TranslateConfigService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [TranslateService])
    ], TranslateConfigService);
    return TranslateConfigService;
}());
export { TranslateConfigService };
//# sourceMappingURL=translate-config.service.js.map
import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogoutPage } from './logout.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from '../translate-config.service';
export function LanguageLoader(http) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
var routes = [
    {
        path: '',
        component: LogoutPage
    }
];
var LogoutPageModule = /** @class */ (function () {
    function LogoutPageModule() {
    }
    LogoutPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (LanguageLoader),
                        deps: [HttpClient]
                    }
                }),
                RouterModule.forChild(routes)
            ],
            declarations: [LogoutPage],
            providers: [TranslateConfigService]
        })
    ], LogoutPageModule);
    return LogoutPageModule;
}());
export { LogoutPageModule };
//# sourceMappingURL=logout.module.js.map
import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ListPage } from './list.page';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateConfigService } from '../translate-config.service';
export function LanguageLoader(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
var ListPageModule = /** @class */ (function () {
    function ListPageModule() {
    }
    ListPageModule = tslib_1.__decorate([
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
                RouterModule.forChild([
                    {
                        path: '',
                        component: ListPage
                    }
                ])
            ],
            declarations: [ListPage],
            providers: [TranslateConfigService]
        })
    ], ListPageModule);
    return ListPageModule;
}());
export { ListPageModule };
//# sourceMappingURL=list.module.js.map
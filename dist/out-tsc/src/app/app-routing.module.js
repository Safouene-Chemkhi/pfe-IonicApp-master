import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
var routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', loadChildren: './home/home.module#HomePageModule' },
    //{path: 'home',loadChildren: './home/home.module#HomePageModule', canActivate : [AuthGuardService]},
    { path: 'list', loadChildren: './list/list.module#ListPageModule' },
    { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
    { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
    { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' },
    { path: 'reports', loadChildren: './reports/reports.module#ReportsPageModule' },
    { path: 'reportform', loadChildren: './report-form/report-form.module#ReportFormPageModule' },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map
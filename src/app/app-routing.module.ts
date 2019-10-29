import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  {path: '',redirectTo: 'login',pathMatch: 'full'},
  {path: 'home',loadChildren: './home/home.module#HomePageModule'},
  //{path: 'home',loadChildren: './home/home.module#HomePageModule', canActivate : [AuthGuardService]},
  {path: 'list',loadChildren: './list/list.module#ListPageModule'},
  {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
  {path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule'},
  { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' },
  { path: 'reports', loadChildren: './reports/reports.module#ReportsPageModule' },
  { path: 'report-form', loadChildren: './report-form/report-form.module#ReportFormPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

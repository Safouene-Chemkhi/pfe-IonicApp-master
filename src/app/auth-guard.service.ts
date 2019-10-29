import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  implements CanActivate{
  constructor(public nav: NavController) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    console.log(route);

    let authInfo = {
      authenticated: localStorage.getItem('_token')
    };

    if (!authInfo.authenticated) {
      this.nav.navigateRoot('login');
      return false;
    }

    return true;

  }
}

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor(
    private translate: TranslateService
  ) {       this.translate.use('en');
}
 
  getDefaultLanguage(){
    //let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang('en');
    return 'en';
  }
 
  setLanguage(setLang) {
    if(setLang == true){
      this.translate.use('fr');
    } else{
      this.translate.use('en');

    }
  }
}

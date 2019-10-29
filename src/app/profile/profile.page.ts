import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  data: any;
  selectedLanguage:boolean;
  constructor(private loadingController: LoadingController, private httpNative: HTTP, private translateConfigService: TranslateConfigService) { 
    var lang = localStorage.getItem('lang');
    if(lang ){
      this.selectedLanguage = (lang=='fr');
      this.translateConfigService.setLanguage(lang=='fr');
    }else{
      this.selectedLanguage = false;
      this.translateConfigService.setLanguage(false);
    }
  }

  languageChanged(){
    console.log('language changed');
    this.translateConfigService.setLanguage(this.selectedLanguage);
    if(this.selectedLanguage == true){
      localStorage.setItem('lang', 'fr');
    }else {
      localStorage.setItem('lang', 'en');
    }
  }
  ngOnInit() {
    //this.presentLoading() 
    var token = localStorage.getItem("_token");
    this.get_user_profile(token);
  }
  get_user_profile(token) {
    console.log("requesting record list ...");
    this.httpNative.get('https://api.hexoskin.com/api/account/', {}, { "Authorization": "Bearer " + token, "Content-Type": "application/json" }).then((list) => {
    this.data = JSON.parse(list.data)["objects"][0];
    localStorage.setItem("email",this.data.email)  
      console.log(JSON.stringify(this.data));
      //this.loadingController.dismiss();
    }, (err) => {
      console.error(JSON.stringify(err));
    })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Fetching user info ...',
      duration: 20000,
      translucent: true
    });
    await loading.present();
  }

}

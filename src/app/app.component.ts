import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreenPage } from './splash-screen/splash-screen.page';
import { TranslateConfigService } from './translate-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [

    {
      title: 'MENU.1',
      url: '/profile',
      icon: 'assets/icon/profil.png'
    },
    {
      title: 'MENU.2',
      url: '/list',
      icon: 'assets/icon/records.png'
    },
    {
      title: 'MENU.3',
      url: '/reports',
      icon: 'assets/icon/reports.png'
    },
    {
      title: 'MENU.4',
      url: '/logout',
      icon: 'assets/icon/logout.png'
    }
  ];

  params = {
    "background": "assets/images/background/back.jpg",
    "image": "assets/icon/logo2.png",
    "title": "Activity Detector"
  };

  selectedLanguage: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private translateConfigService: TranslateConfigService
  ) {
    this.initializeApp();
    
  }

  menuOpened(){
    console.log('menu opened ...');
    var lang = localStorage.getItem('lang');
    if (lang) {
      this.selectedLanguage = (lang == 'fr');
      this.translateConfigService.setLanguage(lang == 'fr');
    } else {
      this.selectedLanguage = false;
      this.translateConfigService.setLanguage(false);
    }
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
      this.presentModal();
    });
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: SplashScreenPage,
      componentProps: { value: 123 },
      cssClass: "modal-fullscreen"
    });
    return await modal.present();
  }

}

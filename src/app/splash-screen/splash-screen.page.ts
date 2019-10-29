import { Component, OnInit } from '@angular/core';
import { ViewController } from '@ionic/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit {

  constructor(private modalCtrl: ModalController, public splashScreen: SplashScreen) {
    console.log("splashscree");
    
  }

  ionViewDidEnter() {

    this.splashScreen.hide();

    setTimeout(() => {
      this.modalCtrl.dismiss();
    }, 4000);

  }

  ngOnInit() {
  }

}

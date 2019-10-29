import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  constructor(private modalCtrl: ModalController) {
    console.log("loading user data");
    
  }

  ionViewDidEnter() {

    setTimeout(() => {
      this.modalCtrl.dismiss();
    }, 4000);

  }
  ngOnInit() {
  }

}

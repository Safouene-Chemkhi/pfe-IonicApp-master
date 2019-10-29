import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  records: any;
  count = 0;
  id1: any;
  selectedLanguage:boolean;
  loading_message = 'Fetching data..' ;
  alert_message = 'Select now another record to compare with!';
  header = 'Next record';
  constructor(public alertController: AlertController, private httpNative: HTTP, private router: Router, private loadingController: LoadingController,private translateConfigService: TranslateConfigService) {
    var lang = localStorage.getItem('lang');
    if(lang ){
      this.selectedLanguage = (lang=='fr');
      this.translateConfigService.setLanguage(lang=='fr');
      if(lang == 'fr'){
        this.alert_message = 'Selectionnez un deuxième enregistrement pour faire la comparaison!';
        this.loading_message = 'Téléchargement des données..';
        this.header = "Enregistrement suivant";
      }
    }else{
      this.selectedLanguage = false;
      this.translateConfigService.setLanguage(false);

    } }
  languageChanged(){
    console.log('language changed');
    this.translateConfigService.setLanguage(this.selectedLanguage);
    if(this.selectedLanguage == true){
      localStorage.setItem('lang', 'fr');
      this.alert_message = 'Selectionnez un deuxième enregistrement!';
      this.loading_message = 'Téléchargement..';
      this.header = "Enregistrement suivant";
    }else {
      localStorage.setItem('lang', 'en');
      this.alert_message = 'Select now another record to compare with!';
      this.loading_message = 'Fetching data..';
      this.header = 'Next record';

    }
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.loading_message,
      duration: 20000,
      translucent: true
    });
    await loading.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.header ,
      message: this.alert_message,
      buttons: ['OK']
    });

    await alert.present();
  }
  isCheckboxDisabled: boolean[] = [];
  index1: any;
  onClick(id, index) {


    if (this.count == 0) {
      this.count = this.count + 1;
      this.id1 = id;
      this.presentAlert()
      this.isCheckboxDisabled[index] = true;
      this.index1 = index;
      
    } else {
      this.isCheckboxDisabled[index] = true;
      this.count = this.count - 1;
      console.log('Going to data_charts ...');
      this.router.navigate(['/home/', { id1: this.id1, date1: this.records[this.index1]["start_date"], duration1: this.records[this.index1]["duration"], id2: id, date2: this.records[index]["start_date"] }]);


    }

  }
  get_record_list(token) {
    console.log("requesting record list ...");
    this.httpNative.get('https://api.hexoskin.com/api/record/?limit=999', {}, { "Authorization": "Bearer " + token, "Content-Type": "application/json" }).then((list) => {
      this.records = JSON.parse(list.data)["objects"];
      for (let index = 0; index < JSON.parse(list.data)["objects"].length; index++) {
        this.isCheckboxDisabled.push(false);
      }
      console.log(JSON.stringify(this.records));
      this.loadingController.dismiss();
    }, (err) => {
      console.error(JSON.stringify(err));
    })
  }

  ionViewWillEnter() {
    if (this.isCheckboxDisabled){
      for (let index = 0; index < this.isCheckboxDisabled.length; index++){
        this.isCheckboxDisabled[index] = false;     
      }
    }
  }
  ngOnInit() {
    this.presentLoading()
    var token = localStorage.getItem("_token");
    this.get_record_list(token);
  }
}

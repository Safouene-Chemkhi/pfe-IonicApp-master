import { Component, OnInit, Input } from '@angular/core';
import { TranslateConfigService } from '../translate-config.service';
import { HTTP } from '@ionic-native/http/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.page.html',
  styleUrls: ['./report-form.page.scss'],
})
export class ReportFormPage implements OnInit {
  record_id1: any;
  record_date1: any;
  duration1: any;
  medecin: any;
  selectedLanguage: boolean;
  constructor(public alertController: AlertController, private translateConfigService: TranslateConfigService, private router: Router, private httpNative: HTTP, private route: ActivatedRoute) {
    var lang = localStorage.getItem('lang');
    if (lang) {
      this.selectedLanguage = (lang == 'fr');
      this.translateConfigService.setLanguage(lang == 'fr');
      if (lang == 'fr') {

      }
    } else {
      this.selectedLanguage = false;
      this.translateConfigService.setLanguage(false);

    }
  }
  ngOnInit() {
    //{ id1: this.record_id1, date1: this.record_date1, duration: this.duration1, medecin: res.data["name"] }
    this.record_id1 = this.route.snapshot.paramMap.get('id1');
    this.record_date1 = this.route.snapshot.paramMap.get('date1');
    this.duration1 = this.route.snapshot.paramMap.get('duration');
    this.medecin = this.route.snapshot.paramMap.get('medecin');
  }

  languageChanged() {
    console.log('language changed');
    this.translateConfigService.setLanguage(this.selectedLanguage);
    if (this.selectedLanguage == true) {
      localStorage.setItem('lang', 'fr');

    } else {
      localStorage.setItem('lang', 'en');


    }
  }



  name: String;
  title: String;
  description: String;

  async presentAlertError(err) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'This is an error message.',
      message: err,
      buttons: ['OK']
    });

    await alert.present();
  }

  submit(report) {
    let post = {
      email: localStorage.getItem("email"),
      report: {
        author: this.medecin,
        text: report,
        date: new Date(),
        record: this.record_id1,
        record_duration: this.duration1,
        record_date: this.record_date1
      }
    }
    this.httpNative.post('http://192.168.1.8:5000/report', post, {}).then(() => {
      this.router.navigate(['/reports']),
        (err) => {
          this.presentAlertError(err.message)
        }
    }
    ).catch((err) => {
      this.presentAlertError(err)
    })
  }

}

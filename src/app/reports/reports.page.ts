import { Component, AfterViewInit, Input, ViewChild, OnInit } from '@angular/core';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { TranslateConfigService } from '../translate-config.service';
import { AlertController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { DatePipe, SlicePipe } from '@angular/common';


@Component({
    selector: 'app-reports',
    templateUrl: './reports.page.html',
    styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
    selectedLanguage: boolean;
    reports: any;
    header = "Report information";
    author_name = "Written by Dr.";
    id = "Record ID:";
    date = "Recorded in:";
    duration = "Duration:";
    constructor(public alertController: AlertController, private translateConfigService: TranslateConfigService, private httpNative: HTTP) {
        var lang = localStorage.getItem('lang');
        if (lang) {
            this.selectedLanguage = (lang == 'fr');
            this.translateConfigService.setLanguage(lang == 'fr');
            if (lang == 'fr') {
                this.header = "Rapport";
                this.author_name = "Écrit par Dr.";
                this.id="Identifiant:";
                this.date="Enregistré le:";
                this.duration="Durée:";
            }
        } else {
            this.selectedLanguage = false;
            this.translateConfigService.setLanguage(false);

        }
    }

    languageChanged() {
        console.log('language changed');
        this.translateConfigService.setLanguage(this.selectedLanguage);
        if (this.selectedLanguage == true) {
            localStorage.setItem('lang', 'fr');
            this.header = "Rapport";
            this.author_name = "Écrit par Dr.";
            this.id="Identifiant:";
            this.date="Enregistré le:";
            this.duration="Durée:";
        } else {
            localStorage.setItem('lang', 'en');
            this.header = "Report information";
            this.author_name = "Written by Dr.";
            this.id="Record ID: ";
            this.date="Recorded in: ";
            this.duration="Duration: ";
        }
    }
    async presentAlertError(err) {
        const alert = await this.alertController.create({
            header: 'Alert',
            subHeader: 'This is an error message.',
            message: err,
            buttons: ['OK']
        });

        await alert.present();
    }

    async presentAlertReport(message, author) {
        const alert = await this.alertController.create({
            header: this.header,
            subHeader: author,
            message: message,
            buttons: ['OK']
        });

        await alert.present();
    }

    ngOnInit() {
        this.httpNative.get('http://192.168.1.8:5000/patient/' + localStorage.getItem("email"), '', {}).then(res => {
            this.reports = JSON.parse(res.data).report;
        }).catch((e) => {
            console.log(e);
            this.presentAlertError(e.message)
        })
    }

    onClick(item, index) {
        let datePipe = new DatePipe('en-US');
        let slicePipe = new SlicePipe();
        let message: string
        message = `<ion-icon name="calendar"><b><h6>` + datePipe.transform(item.date, 'dd/MM/yyyy') + `</b></h6></ion-icon>
        <h6>`+this.id+`<b>` + item.record + `</b></h6>
        <h6>`+this.date+`<b>` + datePipe.transform(item.record_date, 'dd/MM/yyyy') + `</b></h6>
        <h6>`+this.duration+`<b>` + slicePipe.transform(item.record_duration, 0, 7) + `</b></h6>
        <h6><b>Notes: </b> <br />` + item.text + `</h6>`;

        let author = this.author_name + item.author;
        this.presentAlertReport(message, author)
    }


}


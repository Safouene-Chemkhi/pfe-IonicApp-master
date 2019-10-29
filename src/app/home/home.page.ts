import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { color } from 'd3';
import { colorSets } from '@swimlane/ngx-charts/release/utils';
import { LoginPage } from '../login/login.page';
import { HTTP } from '@ionic-native/http/ngx';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as HighCharts from 'highcharts';
import { StockChart } from 'angular-highcharts';
import 'chartjs-plugin-zoom';
import { TranslateConfigService } from '../translate-config.service';
import { TranslatePipe } from '@ngx-translate/core';

//import { HttpClient } from '@angular/common/http';
var send: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [HTTP, TranslatePipe]
})
export class HomePage {
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('radarCanvas') radarCanvas;
  datawithcolor: any[] = [];

  rundata: any[] = [];
  restdata: any[] = [];
  stairsdata: any[] = [];
  walkdata: any[] = [];
  falldata: any[] = [];
  liedata: any[] = [];
  labels = [
    'Up & Down the stairs',
    'Resting',
    'Lying',
    'Running',
    'Walking',
    'Falling'
  ];
  labels_chart = [
    'Stairs',
    'Rest',
    'Lie',
    'Run',
    'Walk',
    'Fall'
  ];
  radar_label = "record";
  loading_message = 'Loading in progress..';
  header1 = 'Are you a doctor ?';
  message1 = 'Please press yes or no!';
  text1 = 'no';
  text2 = 'yes';
  header2 = 'Doctor code';
  message2 = 'Please enter your code!';
  text3 = 'Cancel';
  text4 = 'Ok';
  activities_name: string[] = [''];
  new_data: any;
  lineChart: any;
  radarChart: any;
  record_date1: any;
  record_date2: any;
  duration1: any;
  record_id1: any;
  record_id2: any;

  x: any;
  radar1 = {
    rest: 0,
    walk: 0,
    run: 0,
    fall: 0,
    lie: 0,
    stairs: 0
  };
  radar2 = {
    rest: 0,
    walk: 0,
    run: 0,
    fall: 0,
    lie: 0,
    stairs: 0
  };
  // send: any;
  activityData: any;
  chart_color: string[] = [''];
  accNorm = {
    time: [],
    values: []
  };
  accX = {
    time: [],
    values: []
  };
  accY = {
    time: [],
    values: []
  };
  accZ = {
    time: [],
    values: []
  };
  selectedLanguage: boolean;
  constructor(public modalController: ModalController, private pipe: TranslatePipe, public alertController: AlertController, private httpNative: HTTP, private router: Router, private route: ActivatedRoute, private loadingController: LoadingController, private translateConfigService: TranslateConfigService) {
    //this.selectedLanguage = (this.translateConfigService.getDefaultLanguage()=='en');
    var lang = localStorage.getItem('lang');
    if (lang) {
      this.selectedLanguage = (lang == 'fr');
      this.translateConfigService.setLanguage(lang == 'fr');
      if (lang == 'fr') {
        this.loading_message = 'Traitement en cours..';
        this.radar_label = "enregis.";
        this.header1 = 'Êtes-vous Docteur ?';
        this.message1 = 'Répondez par oui ou non!';
        this.text1 = 'non';
        this.text2 = 'oui';
        this.header2 = 'Code du médecin';
        this.message2 = 'Tapez votre code svp!';
        this.text3 = 'Annuler';
        this.text4 = 'Ok';
        this.labels = [
          'Monter & descendre escaliers',
          "Se Reposer",
          "S'allonger",
          'Courir',
          'Marcher',
          'Tomber',
          "S'accroupir"
        ];
        this.labels_chart = [
          "Escaliers",
          "Se Reposer",
          "S'allonger",
          'Courir',
          'Marcher',
          'Tomber',
          "S'accroupir"
        ];
      }
    } else {
      this.selectedLanguage = false;
      this.translateConfigService.setLanguage(false);
    }
    console.log(this.pipe.transform('HOME.activity1'));

  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      header: this.header1,
      //subHeader: 'Subtitle',
      message: this.message1,
      buttons: [
        {
          text: this.text1,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.text2,
          handler: () => {
            console.log('Confirm Ok');
            this.presentAlertDoctorCode();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertError(err) {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'This is an error message.',
      message: err,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertDoctorCode() {
    const alert = await this.alertController.create({
      inputs: [
        {
          name: 'code',
          type: 'password'
        }],
      header: this.header2,
      //subHeader: 'Subtitle',
      message: this.message2,
      buttons: [
        {
          text: this.text3,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.text4,
          handler: (alertData) => {
            console.log('Code entered');
            this.verify_doctor(alertData.code);
            console.log(alertData.code);
          }
        }
      ]
    });

    await alert.present();
  }

  verify_doctor(code) {
    this.httpNative.get('http://192.168.1.8:5000/medecin/' + code, '', {}).then(res => {

      this.router.navigate(['/report-form', { id1: this.record_id1, date1: this.record_date1, duration: this.duration1, medecin: JSON.parse(res.data)[`name`] }]);
      console.log('he is a doctor');
    }, (e) => {
      this.presentAlertError(JSON.stringify(e))
    })

  }

  navigateTo() {
    //this.router.navigate(['/report-form', { id1: this.record_id1, date1: this.record_date1, duration: this.duration1, medecin: "name" }]);

    this.presentAlertMultipleButtons();
  }
  languageChanged() {
    console.log('language changed');
    this.translateConfigService.setLanguage(this.selectedLanguage);
    if (this.selectedLanguage == true) {
      localStorage.setItem('lang', 'fr');
      this.loading_message = 'Traitement en cours..';
      this.radar_label = "enregis.";
      this.header1 = 'Êtes-vous Docteur ?';
      this.message1 = 'Répondez par oui ou non!';
      this.text1 = 'non';
      this.text2 = 'oui';
      this.header2 = 'Code du médecin';
      this.message2 = 'Tapez votre code svp!';
      this.text3 = 'Annuler';
      this.text4 = 'Ok';
      this.labels = [
        'Monter & descendre escaliers',
        "Se Reposer",
        "S'allonger",
        'Courir',
        'Marcher',
        'Tomber',
        "S'accroupir",
      ];
      this.labels_chart = [
        "Escaliers",
        "Se Reposer",
        "S'allonger",
        'Courir',
        'Marcher',
        'Tomber',
        "S'accroupir"
      ];
    } else {
      localStorage.setItem('lang', 'en');
      this.header1 = 'Are you a doctor ?';
      this.message1 = 'Please press yes or no!';
      this.text1 = 'no';
      this.text2 = 'yes';
      this.header2 =  'Doctor code';
      this.message2 = 'Please enter your code!';
      this.text3 = 'Cancel';
      this.text4 = 'Ok';
      this.radar_label = "record";
      this.loading_message = 'Loading in progress..';
      this.labels = [
        'Up & Down the stairs',
        'Resting',
        'Lying',
        'Running',
        'Walking',
        'Falling'
      ];
      this.labels_chart = [
        'Stairs',
        'Rest',
        'Lie',
        'Run',
        'Walk',
        'Fall'
      ];
    }
    this.radarChartMethod();
    this.highChartMethod();
  }

  msToTime(duration) {

    var seconds = Math.trunc(duration / 64) % 60
      , minutes = Math.trunc(duration / (60 * 64)) % 60
      , hours = Math.trunc(duration / (64 * 60 * 60)) % 24;


    return hours + "h " + minutes + "m " + seconds + "s";
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.loading_message,
      duration: 20000,
      translucent: true
    });
    await loading.present();
  }

  public records: any;
  public recordsX: any;
  public recordsY: any;
  public recordsZ: any;


  get_records(token, record_id1, record_id2) {
    this.chart_color = [];
    this.httpNative.get('https://api.hexoskin.com/api/data/?datatype__in=49,4145,4146,4147&record=' + record_id1, {}, { "Authorization": "Bearer " + token, "Content-Type": "application/json" })
      .then(async res => {
        this.records = JSON.parse(res.data)[0]["data"]["49"];
        //this.prepare_data();
        this.prepare_data2();
        this.httpNative.setDataSerializer('json');
        this.httpNative.post('http://192.168.1.8:5000/', JSON.parse(res.data)[0]["data"], {}).then(
          //this.httpNative.post('http://192.168.137.92:5000/', JSON.parse(res.data)[0]["data"], {}).then(
          data => {
            console.log("activities: ");
            this.activityData = JSON.stringify(data.data);
            var activities_json = JSON.parse(data.data)
            console.log(activities_json.length);

            for (let index = 0; index < activities_json.length; index++) {
              var t: any;
              switch (activities_json[index]) {
                case "rest": {
                  // this.activities_name.push("Sit");
                  // this.chart_color.push("#2f7ed8");
                  this.radar1.rest += 1;

                  this.restdata.push(this.records[index]);
                  break;
                }
                case "run": {
                  //this.activities_name.push("Run");
                  //this.chart_color.push("#0d233a");
                  this.radar1.run += 1;
                  this.rundata.push(this.records[index]);
                  break;
                }
                case "down the stairs": {
                  //this.activities_name.push("Stairs");
                  //this.chart_color.push("#8bbc21");
                  this.radar1.stairs += 1;
                  this.stairsdata.push(this.records[index]);
                  break;
                }
                case "up the stairs": {
                  //this.activities_name.push("Stairs");
                  // this.chart_color.push("#8bbc21");
                  this.radar1.stairs += 1;
                  this.stairsdata.push(this.records[index]);
                  break;
                }
                case "walk": {
                  //this.activities_name.push("Walk");
                  //this.chart_color.push("#910000");
                  this.radar1.walk += 1;
                  this.walkdata.push(this.records[index]);
                  break;
                }
                case "fall-right": {
                  //this.activities_name.push("Fall");
                  //this.chart_color.push("#492970");
                  this.radar1.fall += 1;
                  this.falldata.push(this.records[index]);
                  break;
                }
                case "fall-left": {
                  //this.activities_name.push("Fall");
                  //this.chart_color.push("#492970");
                  this.radar1.fall += 1;
                  this.falldata.push(this.records[index]);
                  break;
                }
                case "fall-back": {
                  //this.activities_name.push("Fall");
                  //this.chart_color.push("#492970");
                  this.radar1.fall += 1;
                  this.falldata.push(this.records[index]);
                  break;
                }
                case "fall-front": {
                  //this.activities_name.push("Fall");
                  //this.chart_color.push("#492970");
                  this.radar1.fall += 1;
                  this.falldata.push(this.records[index]);
                  break;
                }
                case "lying": {
                  //this.activities_name.push("Lie");
                  //this.chart_color.push("#f28f43");
                  this.radar1.lie += 1;
                  this.liedata.push(this.records[index]);
                  break;
                }
                default: {
                  //this.chart_color.push("#77a1e5");
                  break;
                }
              }
            }
          },
          err => {

            console.error(err.status);
            console.error(err);

          }
        ).then(() => {
          // this.loadingController.dismiss();
          this.httpNative.get('https://api.hexoskin.com/api/data/?datatype__in=49,4145,4146,4147&record=' + record_id2, {}, { "Authorization": "Bearer " + token, "Content-Type": "application/json" })
            .then((res) => {
              this.httpNative.setDataSerializer('json');
              this.httpNative.post('http://192.168.1.8:5000/', JSON.parse(res.data)[0]["data"], {}).then(
                //this.httpNative.post('http://192.168.137.92:5000/', JSON.parse(res.data)[0]["data"], {}).then(
                data => {
                  console.log("activities: ");
                  var activities_json = JSON.parse(data.data)
                  for (let index = 0; index < activities_json.length; index++) {
                    switch (activities_json[index]) {
                      case "rest": {
                        this.radar2.rest += 1;
                        break;
                      }
                      case "run": {
                        this.radar2.run += 1;
                        break;
                      }
                      case "down the stairs": {
                        this.radar2.stairs += 1;
                        break;
                      }
                      case "up the stairs": {
                        this.radar2.stairs += 1;
                        break;
                      }
                      case "walk": {
                        this.radar2.walk += 1;
                        break;
                      }
                      case "fall-right": {
                        this.radar2.fall += 1;
                        break;
                      }
                      case "fall-left": {
                        this.radar2.fall += 1;
                        break;
                      }
                      case "fall-back": {
                        this.radar2.fall += 1;
                        break;
                      }
                      case "fall-front": {
                        this.radar2.fall += 1;
                        break;
                      }
                      case "lying": {
                        this.radar2.lie += 1;
                        break;
                      }
                      default: {
                        break;
                      }
                    }
                  }
                  //this.reload();
                  //this.prepare_data3();
                },
                err => {
                  console.error(err.status);
                  console.error(err);
                }
              ).then(() => {
                //console.log(this.accNorm.time[0]);
                // this.stockChartMethod()
                this.radarChartMethod();
                this.highChartMethod();
                // this.lineChartMethod();
                this.loadingController.dismiss();
              })
            })
        })
      }, err => {
        console.log(err);
      }
      )
  }

  prepare_data3() {
    console.log("preparing data ...");
    for (var i = 0; i < this.records.length; i++) {
      var t = {
        y: this.records[i][1],
        x: ((this.records[i][0] * 1000 / 256) - (5 * 60 * 60 * 1000)),
        color: this.chart_color[i],
        name: this.activities_name[i]
      }
      this.datawithcolor.push(t)
    }
  }

  prepare_data() {
    console.log("preparing data ...");
    for (var i = 0; i < this.records.length; i++) {
      this.accNorm.time.push(new Date(this.records[i][0] * 1000 / 256));
      this.accNorm.values.push(this.records[i][1]);
    }
  }

  prepare_data2() {
    console.log("preparing data2 ...");
    for (var i = 0; i < this.records.length; i++) {
      this.records[i][0] = (this.records[i][0] * 1000 / 256) - (5 * 60 * 60 * 1000)
    }
  }
  async ngOnInit() {

    var token = localStorage.getItem("_token");
    this.record_id1 = this.route.snapshot.paramMap.get('id1');
    this.record_id2 = this.route.snapshot.paramMap.get('id2');
    this.record_date1 = this.route.snapshot.paramMap.get('date1');
    this.record_date2 = this.route.snapshot.paramMap.get('date2');
    this.duration1 = this.route.snapshot.paramMap.get('duration1');
    console.log(this.record_id1);
    console.log(this.record_id2);

    this.presentLoading();
    await this.get_records(token, this.record_id1, this.record_id2);

  }

  radarChartMethod() {
    this.radarChart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',

      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.radar_label + ' 1',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(219,0,0,0.4)',
            borderColor: 'rgba(219,0,0,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(219,0,0,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(219,0,0,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            borderWidth: 1,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [(this.radar1.stairs) / 3840, (this.radar1.rest) / 3840, (this.radar1.lie) / 3840, (this.radar1.run) / 3840, (this.radar1.walk) / 3840, (this.radar1.fall) / 3840],
            spanGaps: false,
          },
          {
            label: this.radar_label + ' 2',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(66, 141, 255,0.4)',
            borderColor: 'rgba(66, 141, 255, 1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            borderWidth: 1,
            pointBorderColor: 'rgba(66, 141, 255, 1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(66, 141, 255, 1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [(this.radar2.stairs) / 3840, (this.radar2.rest) / 3840, (this.radar2.lie) / 3840, (this.radar2.run) / 3840, (this.radar2.walk) / 3840, (this.radar2.fall) / 3840],
            spanGaps: false,
          }
        ]
      }
    });
  }
  params = {
    "image": ""
  };
  public lineChartLegend: boolean = true;
  lineChartMethod() {
    //adding custom chart type

    this.params.image = '../../assets/icon/labels.png';
    Chart.defaults.multicolorLine = Chart.defaults.line;
    Chart.controllers.multicolorLine = Chart.controllers.line.extend({
      draw: function (ease) {
        var
          startIndex = 0,
          meta = this.getMeta(),
          points = meta.data || [],
          colors = this.getDataset().colors,
          area = this.chart.chartArea,
          originalDatasets = meta.dataset._children
            .filter(function (data) {
              return !isNaN(data._view.y);
            });

        function _setColor(newColor, meta) {
          meta.dataset._view.borderColor = newColor;
        }

        if (!colors) {
          Chart.controllers.line.prototype.draw.call(this, ease);
          return;
        }

        for (var i = 2; i <= colors.length; i++) {
          if (colors[i - 1] !== colors[i]) {
            _setColor(colors[i - 1], meta);
            meta.dataset._children = originalDatasets.slice(startIndex, i);
            meta.dataset.draw();
            startIndex = i - 1;
          }
        }

        meta.dataset._children = originalDatasets.slice(startIndex);
        meta.dataset.draw();
        meta.dataset._children = originalDatasets;

        points.forEach(function (point) {
          point.draw(area);
        });
      }
    });


    //console.log(this.chart_color);
    var data_set: any;
    data_set = [
      {
        //labels :['Sit','Run','Walk','Lie','Stairs','Fall','Squat'],
        // label: null,
        fill: false,
        lineTension: 0,
        //borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        colors: this.chart_color,
        borderDash: [],
        borderWidth: 1,
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 1,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 0,
        pointRadius: 0,
        pointHitRadius: 10,
        data: this.accNorm.values,
        //backgroundColor: 'rgba(75,192,192,0.4)',
        spanGaps: false,
      }
    ]

    var _options: any;
    _options = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            console.log(tooltipItem)
            return tooltipItem.yLabel;
          }
        }
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              // round: 'day'
              tooltipFormat: "ll HH:mm"
            },
            scaleLabel: {
              display: true,
              labelString: "Date"
            },
            ticks: {
              maxRotation: 0
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "value"
            }
          }
        ]
      },
      pan: {
        enabled: true,
        mode: "x",
        speed: 10,
        threshold: 0.05
      },
      zoom: {
        enabled: true,
        drag: false,
        mode: "x",
        limits: {
          max: 10,
          min: 0.5
        }
      }
    }


    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'multicolorLine',
      data: {
        labels: this.accNorm.time,
        datasets: data_set,
      },
      options: _options
    });
  }
  stock: StockChart;
  param: any;

  stockChartMethod() {
    var data_set: any;
    data_set = [
      {
        //labels :['Sit','Run','Walk','Lie','Stairs','Fall','Squat'],
        // label: null,
        fill: false,
        lineTension: 0,
        //borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        colors: this.chart_color,
        borderDash: [],
        borderWidth: 1,
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 1,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 0,
        pointRadius: 0,
        pointHitRadius: 10,
        data: this.accNorm.values,
        //backgroundColor: 'rgba(75,192,192,0.4)',
        spanGaps: false,
      }
    ]
    this.param = [{
      tooltip: {
        valueDecimals: 2
      },
      name: 'AAPL',
      data: {
        labels: this.accNorm.time,
        datasets: data_set,
      }
    }];
    this.stock = new StockChart({
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'AAPL Stock Price'
      },
      series: this.param
    });
  }
  serieH: any;
  allseries: any;
  highChartMethod() {

    this.serieH = [{
      type: 'scatter',
      data: this.datawithcolor,
      tooltip: {
        valueDecimals: 2
      },
      xAxes: {
        ticks: {
          autoSkip: false
        }
      },
      showInLegend: true,
      boostThreshold: 1
    }]


    this.allseries = [
      {
        type: 'line',
        name: this.labels_chart[1],
        data: this.restdata,
        color: '#1be5db'
      },
      {
        type: 'line',
        name: this.labels_chart[5],
        data: this.falldata,
        color: '#e8001e'
      },
      {
        type: 'line',
        name: this.labels_chart[3],
        data: this.rundata,
        color: '#0700e8'
      },
      {
        type: 'line',
        name: this.labels_chart[4],
        data: this.walkdata,
        color: '#0fb700'
      },
      {
        type: 'line',
        name: this.labels_chart[2],
        data: this.liedata,
        color: '#9da39c'
      },
      {
        type: 'line',
        name: this.labels_chart[0],
        data: this.stairsdata,
        color: '#e2a50b'
      }
    ]
    HighCharts.stockChart('container', {
      legend: {
        enabled: true,
        floating: true,
        layout: 'horizontal',
        borderWidth: 1,
        borderColor: '#444444',
        shadow: true,
        backgroundColor: 'rgba(32, 32, 32, .75)',
        align: 'center',
        //x: 80,
        verticalAlign: 'top',
        y: 25,
        itemStyle: {
          color: '#CCCCCC',

          listStyle: 'none',
          listStyleImage: 'none'
        },
        itemHiddenStyle: {
          color: '#444444'
        },
        itemHoverStyle: {
          color: 'white'
        }
      },
      rangeSelector: {
        inputEnabled: false
      },

      boost: {
        seriesThreshold: 1
      },
      plotOptions: {

        scatter3d: {
          showInLegend: true
        },
        series: {
          gapSize: 1,
          lineWidth: 0.8,

          turboThreshold: 10000000000,
          dataGrouping: {
            enabled: false
          },
          boostThreshold: 1,
          showInLegend: true

        },
        scatter: {
          marker: {
            radius: 1
          }
        },
        column: {
          colorByPoint: true
        }
      },

      //  colors:this.chart_color,
      series: this.allseries,
      credits: {
        enabled: false
      },

      xAxis: {
        type: 'datetime',
        minRange: 1,
        title: {
          text: 'Date'
        }
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { TranslateConfigService } from '../translate-config.service';

var responseParameters;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [HTTP]
})
export class LoginPage implements OnInit {
  token_json :any;
  activityData : any;
  options: InAppBrowserOptions = {
    location: 'yes',//Or 'no' 
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only 
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only 
    toolbar: 'yes', //iOS only 
    enableViewportScale: 'no', //iOS only 
    allowInlineMediaPlayback: 'no',//iOS only 
    presentationstyle: 'pagesheet',//iOS only 
    fullscreen: 'yes',//Windows only    
  };

  selectedLanguage:boolean;
  loading_message = 'Downloading User Data..';

  constructor(private router: Router , private translateConfigService: TranslateConfigService, private loadingController: LoadingController, private httpNative : HTTP) { 
    var lang = localStorage.getItem('lang');
    if(lang ){
      this.selectedLanguage = (lang=='fr');
      this.translateConfigService.setLanguage(lang=='fr');
      if(lang == 'fr'){
        this.loading_message = 'Téléchargement des données en cours..';
      }
    }else{
      this.selectedLanguage = false;
      this.translateConfigService.setLanguage(false);
    }
  }

  ngOnInit() {
    var refresh_token = localStorage.getItem("_refrech_token")

    setTimeout(() => {

/*        if(refresh_token){
            this.presentLoading();
            this.get_token_refresh(refresh_token)
        }
        else{*/
          this.get_auth_code().then((value) => {
            //localStorage.setItem("_token", value);
            this.presentLoading();
            this.get_token(value);
          }, (error) => {
            console.error(error);
          });
  
          //  console.log("storage code:");
          // console.log(localStorage.getItem("code"));
          console.log("storage token:");
          console.log(localStorage.getItem("_token"));
       // }


      
    }, 4000);

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.loading_message,
      duration: 20000,
      spinner: "crescent"
    });
    await loading.present();
    console.log('Loading dismissed!');
  }

  



  get_auth_code() {
    return new Promise<string>(function (resolve, reject) {
      var browserRef = (<any>window).cordova.InAppBrowser.open("https://api.hexoskin.com/api/connect/oauth2/auth/?scope=readwrite&state=3991737&redirect_uri=https://app.getpostman.com/oauth2/callback&response_type=code&client_id=aI4mbAzOvxNVO6exipoK7KMShi4lsD", "_self", "location=no,clearsessioncache=yes,clearcache=yes");
      browserRef.addEventListener("exit", function (event) {
        reject("The Application sign in flow was canceled");
      });

      browserRef.addEventListener("loadstart", (event: any) => {
        console.log('listen event oauth callback');
        console.log(event.url);

        if ((event.url).indexOf("https://app.getpostman.com/oauth2/callback") === 0) {
          browserRef.removeEventListener("exit", (event) => { });
          console.log(event.url);
          responseParameters = ((event.url).split("?")[1]).split("&");
          // console.log(responseParameters);
          var parsedResponse = {};
          for (var i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }
          if (parsedResponse["code"] !== undefined && parsedResponse["code"] !== null) {
            resolve(parsedResponse["code"]);
          }
          else {
            reject("Problem authenticating with Activity Detector");
          }

          browserRef.close();
        }
      });
    });
  }

  get_token_refresh(refresh_token){
    var json = { "grant_type": "refresh_token", "refresh_token" : refresh_token };
    this.httpNative.post('https://api.hexoskin.com/api/connect/oauth2/token/', json, { "Authorization": "Basic YUk0bWJBek92eE5WTzZleGlwb0s3S01TaGk0bHNEOnRubXhRYnB6SDhFblVwVnZKU0pTUDJQVUtWZVpGVQ==", "Content-Type": "application/json" })
      .then((res: any) => {

        this.token_json = JSON.parse(res.data).access_token;
        
        console.log("hexoskin token: ");
        console.log(this.token_json);
        localStorage.setItem("_token", this.token_json);
        //this.access_token = this.token_json;
        //this.get_record_list(this.token_json)
        this.loadingController.dismiss();
        this.router.navigateByUrl('/profile');
            }, (err: Response) => {
        console.error(err.status);
        console.error(err);
        

      }
      );
  }
  get_token(code) {
    
    var json = { "grant_type": "authorization_code", "code": code, "redirect_uri": "https://app.getpostman.com/oauth2/callback" };
    this.httpNative.post('https://api.hexoskin.com/api/connect/oauth2/token/', json, { "Authorization": "Basic YUk0bWJBek92eE5WTzZleGlwb0s3S01TaGk0bHNEOnRubXhRYnB6SDhFblVwVnZKU0pTUDJQVUtWZVpGVQ==", "Content-Type": "application/json" })
      .then((res: any) => {

        this.token_json = JSON.parse(res.data).access_token;
        localStorage.setItem("_refrech_token", JSON.parse(res.data).refresh_token);
        console.log("hexoskin token: ");
        console.log(this.token_json);
        localStorage.setItem("_token", this.token_json);
        //this.access_token = this.token_json;
        //this.get_record_list(this.token_json)
        this.loadingController.dismiss();
        this.router.navigateByUrl('/profile');
            }, (err: Response) => {
       // console.error(err.status);
        console.error(err);
        

      }
      );
}

}

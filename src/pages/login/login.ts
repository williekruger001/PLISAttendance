import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { Network } from '@ionic-native/network';

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //Constants for storage keys
  ENV: string = '_env';
  ENV_SAVE: string = '_envSave';
  BYPASS_LOGIN: string = '_bypassLogin';
  USER: string = '_user';
  AUTH_TIME: string = '_authTime';

  //Variables
  chkChoice: boolean;
  chkShow: boolean;
  isActiveChkShow: boolean = true;
  env: string;
  envSave: boolean;
  bypassLogin: boolean;
  selEnvironment: any;


  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public storage: Storage
    , public platform: Platform
    , public authenticatedUser: AuthenticatedUserProvider
    , public network: Network
    , public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {

    /*this.storage.clear().then(() => {
      alert("Storage cleared.");
    })*/

    this.processAuthentication();

  }

//Everything in the storage provider is async, work within the Promise's

// 1. Check user preferences

// 2. Check if there is an authenticated user

// 3. Check if the authenticated user's session is still valid -- Default is 2 days

// 4. Check for Internet connection

// 5. Do navigation according to user status and preferences

getUserPreferences() {



}


  checkAuthentication() {

    this.storage.get(this.AUTH_TIME).then((val) => {

      let DateDiff: any = {

        inDays: (d1: any, d2: any) => {
          let t2: number = d2.getTime();
          let t1: number = d1.getTime();

          return (t2 - t1) / (24 * 3600 * 1000);
        }
      }

      if (val) {

        if (DateDiff.inDays(Date.now, val) > 1) {
          this.storage.remove(this.USER).then(() => {

            let alert = this.alertCtrl.create({
              title: 'Authentication session.',
              subTitle: 'Your authentication details expired. Please click the login button to update your details.',
              buttons: ['OK']
            });
            alert.present();

          });
        } else {
          this.processAuthentication();
        }
      } else {
        this.processAuthentication();
      }
    });
  }

  processAuthentication() {

    this.storage.get(this.ENV).then((val) => {
      if (val) {
        this.env = val;
        this.selEnvironment = this.env;
      }
    });

    this.storage.get(this.ENV_SAVE).then((val) => {
      if (val) {
        this.envSave = val;
        this.chkChoice = this.envSave;
        this.isActiveChkShow = false;
      }
    });

    this.storage.get(this.BYPASS_LOGIN).then((val) => {
      if (val) {
        this.bypassLogin = val;
        this.chkShow = this.bypassLogin;

        this.storage.get(this.USER).then((val) => {
          if (val) {
            this.authenticatedUser.user = val;

            if (this.bypassLogin == true) {
              if (this.authenticatedUser.user) {

                //Check here how old user session is



                this.navCtrl.push(TabsPage);
              } else {

                if (this.network.type != 'none') {

                  this.createBrowser();
                  if (this.authenticatedUser.user) {
                    this.navCtrl.push(TabsPage);
                  } else {

                    let alert = this.alertCtrl.create({
                      title: 'Authentication issue.',
                      subTitle: 'There was a problem with the authentication process. Please try again.',
                      buttons: ['OK']
                    });
                    alert.present();

                  }

                } else {

                  let alert = this.alertCtrl.create({
                    title: 'Internet Connection',
                    subTitle: 'There is no Internet connection available and no authenticated account in the app. Please ensure an Internet connection to authenticate.',
                    buttons: ['OK']
                  });
                  alert.present();

                }

              }
            }

          }
        });
      }
    });

  }

  createBrowser() {

    this.platform.ready().then(() => {

      const ref = cordova.InAppBrowser.open('https://plis-admin-test.det.wa.edu.au/webapi/plisappauth.aspx', '_blank', 'location=yes');

      ref.addEventListener('loadstop', () => {

        ref.executeScript({ code: 'getAuthenticationInfo();' }, (data) => {

          if (data[0] != null) {


            //Turn the JSON data into an Authenticated user object
            this.authenticatedUser.user = JSON.parse(data[0]);
            this.storage.set(this.USER, this.authenticatedUser.user);
            this.storage.set(this.AUTH_TIME, Date.now());
            ref.close();

          } else {

            alert('No data returned!');

          }

        });

      });

    });

  }

  saveAuthentication() {

    this.storage.set(this.ENV, this.selEnvironment);
    this.storage.set(this.ENV_SAVE, this.chkChoice);
    this.storage.set(this.BYPASS_LOGIN, this.chkShow);

  }

  doLogin() {

    this.saveAuthentication();

    if (!this.authenticatedUser.user) {
      this.createBrowser();
    } else {
      this.navCtrl.push(TabsPage);
    }

  }

  updatechkShow() {

    if (this.chkChoice == true) {
      this.isActiveChkShow = false;
    } else {
      this.chkShow = false;
      this.isActiveChkShow = true;
    }

  }

}

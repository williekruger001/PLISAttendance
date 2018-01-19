import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { Network } from '@ionic-native/network';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //TO DO: Get all parameters from PLIS database on initial start-up of app. Internet connection is required.
  //This will ensure that the app is highly configurable and maintainable without deploying a new release everytime 

  //Constants for storage keys
  ENV: string = '_env';
  ENV_SAVE: string = '_envSave';
  ENV_ARRAY: string = '_envArray';
  BYPASS_LOGIN: string = '_bypassLogin';
  USER: string = '_user';
  AUTH_TIME: string = '_authTime';

  //Variables
  chkChoice: boolean;
  chkShow: boolean;
  isDisabledChkShow: boolean = true;
  env: string;
  envSave: boolean;
  bypassLogin: boolean;
  selEnvironment: any;
  envArray: any = [];


  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public storage: Storage
    , public platform: Platform
    , public authenticatedUser: AuthenticatedUserProvider
    , public network: Network
    , public alertCtrl: AlertController
    , public localDataService: LocalDataServiceProvider) {

  }

  ionViewDidLoad() {

    //this.storage.remove("_eventListLocal");

    this.authenticatedUser.getEnvironments().then((response) => {
      this.envArray = this.authenticatedUser.envArray;
      this.processAuthentication();
    });

  }

  getAuthAge() { //Return a Promise

    return new Promise((resolve, reject) => {

      this.storage.get(this.AUTH_TIME).then((val) => {

        if (val) {

          if ((Date.now() - val) / (24 * 3600 * 1000) < 1) { //TO DO: Put the authentication age in the PLIOS database as a parameter for app initialisation

            resolve(true);

          } else {
            this.storage.remove(this.USER).then(() => {
              reject(Error("The authenticated user's session expired"));
            });

          }

        }

      });

    })

  }

  processAuthentication() {

    this.storage.get(this.ENV).then((val) => {
      if (val) {
        this.env = val;
        this.selEnvironment = this.env;
      } else {
        this.selEnvironment = "prod"
      }
    });

    this.storage.get(this.ENV_SAVE).then((val) => {
      if (val) {
        this.envSave = val;
        this.chkChoice = this.envSave;
        this.isDisabledChkShow = !this.envSave;
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

                this.getAuthAge().then(
                  (response) => {
                    if (response == true) {
                      this.localDataService.getEventListLocal();
                      this.navCtrl.push(TabsPage);
                    }
                  }, (error) => {
                    this.errorAlert(
                      'Authentication session.',
                      'Your authentication details expired. Please click the login button to update your details.'
                    );
                  });

              } else {

                if (this.network.type != 'none') {

                  if (this.authenticatedUser.user) {
                    this.localDataService.getEventListLocal();
                    this.navCtrl.push(TabsPage);
                  } else {
                    this.errorAlert(
                      'Authentication issue.',
                      'There was a problem with the authentication process. Please try again.'
                    );
                  }

                } else {
                  this.errorAlert(
                    'Internet Connection.',
                    'There is no Internet connection available and no authenticated account in the app. Please ensure an Internet connection to authenticate.'
                  );

                }

              }
            }

          }
        });
      }
    });

  }

  createBrowser() { //Return a Promise

    return new Promise((resolve, reject) => {

      this.platform.ready().then(() => {

        this.env = this.selEnvironment;
        //TO DO: Put the login page name into the PLIS database as parameter and initialise app with these values.
        let loginUrl: string = this.authenticatedUser.getEnvironment(this.env).url + "plisappauth.aspx";

        const ref = cordova.InAppBrowser.open(loginUrl, '_blank', 'location=yes');

        ref.addEventListener('loadstop', () => {

          ref.executeScript({ code: 'getAuthenticationInfo();' }, (data) => {

            if (data[0] != null) {


              //Turn the JSON data into an Authenticated user object
              this.authenticatedUser.user = JSON.parse(data[0]);
              this.storage.set(this.USER, this.authenticatedUser.user);
              this.storage.set(this.AUTH_TIME, Date.now());
              ref.close();
              resolve(this.authenticatedUser.user);

            } else {

              reject('No data returned!');

            }

          });

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

    // 1. Check if there is an authenticated user in the data store

    this.storage.get(this.USER).then((val) => {
      if (val) { //There is an authenticated user in the data store        
        //Get the auth age
        this.getAuthAge().then( //Check auth age
          (response) => {
            if (response == true) {
              //Set the singleton for the user
              this.authenticatedUser.user = val;
              this.saveAuthentication();
              //Navigate to landing page
              this.localDataService.getEventListLocal();
              this.navCtrl.push(TabsPage);
            }
          },
          (error) => {
            this.errorAlert(
              'Authentication session.',
              'Your authentication details expired. Please click the login button to update your details.'
            );

          });

      } else { //There is no authenticated user in the data store

        if (this.network.type != 'none') { //We have internet 

          this.createBrowser().then( //Do authentication
            (response) => {
              this.saveAuthentication();
              this.localDataService.getEventListLocal();
              this.navCtrl.push(TabsPage);
            },
            (error) => {
              this.errorAlert(
                'Authentication issue.',
                'There was a problem with the authentication process. Please try again.'
              );

            });

        } else { //No internet connection and no authenticated user in data store

          this.errorAlert(
            'Internet Connection',
            'There is no Internet connection available and no authenticated account in the app. Please ensure an Internet connection to authenticate.'
          );

        }

      }
    });

  }

  updateChkShow() {

    if (this.chkChoice == true) {
      this.isDisabledChkShow = false;
    } else {
      this.chkShow = false;
      this.isDisabledChkShow = true;
    }

  }

  errorAlert(title: string, subTitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

}

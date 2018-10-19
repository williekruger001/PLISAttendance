import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { LoginPage } from '../login/login';
import { GLSecureStorageProvider } from "gl-ionic2-secure-storage/dist/src";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  USER: string = '_user';
  ENV_ARRAY: string = '_envArray';

  networkIcon: string = 'wifi';
  networkIconColor: string = 'green';
  eNumber: any = this.authenticatedUser.user.UserID;
  givenName: any = this.authenticatedUser.user.GivenName;
  surname: any = this.authenticatedUser.user.Surname;
  role: any = this.authenticatedUser.user.Role;
  orgSelected: any = this.authenticatedUser.user.Org_Selected;
  ref: any;
  orgArray: any;
  selOrganisation: any;

  constructor(public navCtrl: NavController,
    public network: Network,
    public iab: InAppBrowser,
    public platform: Platform,
    public authenticatedUser: AuthenticatedUserProvider,    
    public alertCtrl: AlertController,
    private glSecureStorage: GLSecureStorageProvider
  ) {

  }

  ionViewDidLoad() {

    this.platform.ready().then(() => {
      this.checkNetwork();
      this.getOrganisations().then(
        (response) => {
          if (this.authenticatedUser.user.Org_Selected === 99999) {
            this.selOrganisation = 0
          } else {
            this.selOrganisation = this.authenticatedUser.user.Org_Selected;
          }
        },
        (error) => {
          this.errorAlert(
            'User Partions.',
            error
          );
        });

    });
  }

  getOrganisations() {
    return new Promise((resolve, reject) => {
      if (this.authenticatedUser.user.Partitions.length > 0) {
        this.orgArray = this.authenticatedUser.user.Partitions;
        this.orgArray.sort((a, b) => a.OrgName.localeCompare(b.OrgName));
        resolve(this.orgArray);
      } else {
        reject(Error("There are no Partitions for the Authenticated user"));
      }
    })
  }

  logout() {
    this.glSecureStorage.remove(this.USER).then(() => {
      this.glSecureStorage.remove(this.ENV_ARRAY).then(() => {
        this.navCtrl.push(LoginPage);
        //this.platform.exitApp();        
      });
    });
  }

  checkNetwork() {
    this.network.onDisconnect().subscribe(() => {
      this.networkIcon = "warning";
      this.networkIconColor = "orange"
    });

    this.network.onConnect().subscribe(() => {
      this.networkIcon = "wifi";
      this.networkIconColor = "green";
    });
  }

  updateOrg() {
    this.authenticatedUser.user.Org_Selected = this.selOrganisation;
    this.glSecureStorage.set(this.USER, JSON.stringify(this.authenticatedUser.user));
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

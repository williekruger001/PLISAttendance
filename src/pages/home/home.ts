import {
  Component
} from '@angular/core';
import {
  NavController,
  Platform,
  AlertController
} from 'ionic-angular';
import {
  Network
} from '@ionic-native/network';
import {
  InAppBrowser
} from '@ionic-native/in-app-browser';
import {
  AuthenticatedUserProvider
} from '../../providers/authenticated-user/authenticated-user';
import {
  Storage
} from '@ionic/storage';
//import { LoginPage } from '../login/login';

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
    public storage: Storage,
    public alertCtrl: AlertController
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
    this.storage.remove(this.USER).then(() => {
      this.storage.remove(this.ENV_ARRAY).then(() => {
        this.platform.exitApp();
        //this.navCtrl.push(LoginPage);
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
    this.storage.set(this.USER, this.authenticatedUser.user);
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

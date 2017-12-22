import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { LoginPage } from '../login/login'
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  networkIcon: string = 'wifi';
  networkIconColor: string = 'green';
  eNumber: any;
  ref: any;

  constructor(public navCtrl: NavController,
    public network: Network,
    public iab: InAppBrowser,
    public platform: Platform,
    public authenticatedUser: AuthenticatedUserProvider,
    public storage: Storage
  ) {

  }

  ionViewDidLoad() {
    //alert(this.authenticatedUser.user.UserID);

    this.eNumber = this.authenticatedUser.user.UserID;


    this.checkNetwork();
    //this.createBrowser();

  }

  clearStorage() {

    this.storage.clear().then(() => {
      alert("Storage cleared.");
    })
    this.platform.exitApp();
    //this.navCtrl.push(LoginPage);

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

  createBrowser() {

    this.platform.ready().then(() => {


      /*this.ref = cordova.InAppBrowser.open('https://plis-admin-test.det.wa.edu.au/webapi/plisappauth.aspx', '_blank', 'location=yes');

      this.ref.addEventListener('loadstop', () => {
        //this.ref.insertCSS({ code: "body {background-color: black;}" });

        this.ref.executeScript({ code: 'getAuthenticationInfo();' }, (data) => {


          if (data[0] != null) {
            //alert(data[0]);

            //Turn the JSON data into an Authenticated user object
            this.authenticatedUser.user = JSON.parse(data[0]);

            alert(this.authenticatedUser.user.UserID);

            this.ref.close();

          } else {

            alert('No data returned!');

          }
        });



      }
      );*/

      /*const browser = this.iab.create('https://plis-admin-test.det.wa.edu.au/test9.aspx', '_blank', 'location=yes');

      let authenticatedUser: any;

      browser.executeScript({ code: 'getAuthenticationInfo()' }).then(
        (data) => {

          if (data[0] == null) {
            alert('No data returned!');
          } else {
            alert(data[0]);
          }
        },

        (error) => {
          alert(error);
        });*/

    });







  }

}

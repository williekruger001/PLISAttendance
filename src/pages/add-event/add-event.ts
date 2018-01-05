import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddEventPage {

  isHiddenNetworkMsg: boolean = true;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public network: Network) {
  }

  ionViewDidLoad() {
    this.checkNetwork();
  }

  checkNetwork() {

    if (this.network.type != 'none') {
      this.isHiddenNetworkMsg = true;
    } else {
      this.isHiddenNetworkMsg = false;
    }

    this.network.onDisconnect().subscribe(() => {
      this.isHiddenNetworkMsg = false;
    });

    this.network.onConnect().subscribe(() => {
      this.isHiddenNetworkMsg = true;
    });

  }

}

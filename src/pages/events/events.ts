import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AddEventPage } from '../add-event/add-event';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  isDisabledAddEvent: boolean = true;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public modalCtrl: ModalController
    , public network: Network) {
  }

  checkNetwork() {

    if (this.network.type != 'none') {
      this.isDisabledAddEvent = false;
    } else {
      this.isDisabledAddEvent = true;
    }

    this.network.onDisconnect().subscribe(() => {
      this.isDisabledAddEvent = true;
    });

    this.network.onConnect().subscribe(() => {
      this.isDisabledAddEvent = false;
    });


  }

  ionViewDidLoad() {
    this.checkNetwork();
  }

  presentAboutModal() {
    let contactModal = this.modalCtrl.create(AddEventPage);
    contactModal.present();
  }

}

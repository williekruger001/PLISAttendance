import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AddEventPage } from '../add-event/add-event';
import { Network } from '@ionic-native/network';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { SessionPage } from '../session/session'

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  isDisabledAddEvent: boolean = true;
  eventListLocal: any;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public modalCtrl: ModalController
    , public network: Network
    , public localDataService: LocalDataServiceProvider) {



  }

  ionViewDidLoad() {
    this.checkNetwork();
    this.getEventListLocal();
  }

  getEventListLocal() {
    this.eventListLocal = this.localDataService.eventListLocal;

  }

  presentEventsModal() {
    let eventModal = this.modalCtrl.create(AddEventPage);
    eventModal.present();
  }

  getSessionDetails(event, sessionID) {
    this.navCtrl.push(SessionPage, {
      event: event,
      sessionID: sessionID
    });
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
}

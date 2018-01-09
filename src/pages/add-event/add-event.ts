import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { EventServiceProvider } from '../../providers/event-service/event-service'

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
  providers: [EventServiceProvider]
})
export class AddEventPage {

  isHiddenNetworkMsg: boolean = true;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public network: Network
    , public eventService: EventServiceProvider
  ) { }

  ionViewDidLoad() {
    this.checkNetwork();

    /*this.eventService.getEvents().then((response) => {
      alert(response[0].EventName);
    },
      (error) => {
        alert(error);
      }

    )*/
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

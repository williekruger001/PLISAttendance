import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { EventServiceProvider } from '../../providers/event-service/event-service'
import { Storage } from '@ionic/storage';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';


@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',

})
export class AddEventPage {

  isHiddenEmptyListMsg: boolean = true;
  isHiddenNetworkMsg: boolean = true;
  eventList: any;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public network: Network
    , public eventService: EventServiceProvider
    , public storage: Storage
    , public localDataService: LocalDataServiceProvider
    , public viewCtrl: ViewController
    , public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {

    if (this.checkNetwork()) {
      this.loadEvents();
    }
  }

  loadEvents() {
    let env: string

    let loader = this.loadingCtrl.create({
      content: "Please wait while we fetch the events..."
    });
    loader.present();



    this.storage.get('_env').then((val) => {
      if (val) {
        env = val;
      } else {
        env = "prod"
      }
      this.eventService.getEvents(env).then((data) => {
        this.eventList = data;
        this.eventList = this.eventList.d; 

        if (this.eventList && this.eventList.length > 0) {
          this.isHiddenEmptyListMsg = true;
        } else {
          this.isHiddenEmptyListMsg = false;
        }

        loader.dismiss();       
      }, (err) => {
        loader.dismiss(); 
        alert(err);
      });

    });

  }

  addEvent(i: any) {
    this.localDataService.addEventLocal(this.eventList[i]);  
    this.viewCtrl.dismiss(); 
  }

  checkNetwork() {

    this.network.onDisconnect().subscribe(() => {
      this.isHiddenNetworkMsg = false;
    });

    this.network.onConnect().subscribe(() => {
      this.isHiddenNetworkMsg = true;
    });

    if (this.network.type != 'none') {
      this.isHiddenNetworkMsg = true;
      return true
    } else {
      this.isHiddenNetworkMsg = false;
      return false
    }

  }

}

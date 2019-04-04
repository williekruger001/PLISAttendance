import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { EventServiceProvider } from '../../providers/event-service/event-service'
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { LoginPage } from '../login/login';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { GLSecureStorageProvider } from "gl-ionic2-secure-storage/dist/src";


@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',

})
export class AddEventPage {

  USER: string = '_user';
  ENV_ARRAY: string = '_envArray';

  isHiddenEmptyListMsg: boolean = true;
  isHiddenNetworkMsg: boolean = true;
  eventList: any;
  anEvent: any;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public network: Network
    , public eventService: EventServiceProvider
    , public localDataService: LocalDataServiceProvider
    , public viewCtrl: ViewController
    , public loadingCtrl: LoadingController
    , public authenticatedUser: AuthenticatedUserProvider
    , private glSecureStorage: GLSecureStorageProvider
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

    this.glSecureStorage.get('_env').then((val) => {
      if (val) {
        env = JSON.parse(val);
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
        //this.logout();
      });

    });

  }

  getEvent(eventID) {
    return new Promise((resolve, reject) => {   
    
    let env: string

    this.glSecureStorage.get('_env').then((val) => {
      if (val) {
        env = JSON.parse(val);
      } else {
        env = "prod"
      }
      
      this.eventService.getEvent(env, eventID).then((data) => {
        this.anEvent = data;
        this.anEvent = this.anEvent.d;
        resolve(this.anEvent);
      }, (err) => {
        reject(err);
      });

    });
    
  })
  }

  addEvent(i: any) {
    let eID = this.eventList[i].EventID;    
    this.getEvent(eID).then((response) => {      
      if (response) {
        this.localDataService.addEventLocal(response);
        this.viewCtrl.dismiss();
      } else {
        alert("Event not found");
      }
    });   
  }

  logout() {
    this.glSecureStorage.remove(this.USER).then(() => {
      this.glSecureStorage.remove(this.ENV_ARRAY).then(() => {
        this.navCtrl.push(LoginPage);
      });
    });
  }

  closeModal() {
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

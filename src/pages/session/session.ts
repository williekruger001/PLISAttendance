import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SessionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
})
export class SessionPage {

event: any;
sessionID: any;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams) {

      this.event = navParams.get("event");
      this.sessionID = navParams.get("sessionID");
  }

  ionViewDidLoad() {
    alert(this.event.EventName + " " + this.sessionID);
  }

}

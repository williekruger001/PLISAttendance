import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ScanPage } from '../scan/scan'

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
})
export class SessionPage {

  event: any;
  session: any;
  sessionID: any;
  eventID: any;
  eventName: string;
  eventStart: string;
  eventEnd: string;
  sessionName: string;
  sessionStart: string;
  sessionEnd: string;
  checkInTimes: any;
  sessionRegistrationCount: number;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public modalCtrl: ModalController) {

    this.event = navParams.get("event");
    this.sessionID = navParams.get("sessionID");
  }

  ionViewDidLoad() {

    this.setFields();
  }

  setFields() {

    this.eventName = this.event.EventName;
    this.eventID = this.event.EventID;
    this.eventStart = this.event.EventStart;
    this.eventEnd = this.event.EventEnd;

    this.session = this.event.Sessions.find((obj) => {
      return obj.SessionID === this.sessionID;
    });
    
    this.checkInTimes = this.session.CheckInTimes;

    this.sessionName = this.session.SessionName;
    this.sessionStart = this.session.SessionStart;
    this.sessionEnd = this.session.SessionEnd;
    this.sessionRegistrationCount = this.session.SessionAttendees.length;   
  }

  getCheckInDetails(sessionCheckInTimeID) {
    this.navCtrl.push(ScanPage, {
      event: this.event,
      sessionID: this.sessionID,
      sessionCheckInTimeID: sessionCheckInTimeID
    });    
  }

}

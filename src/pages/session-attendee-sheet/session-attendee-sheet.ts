import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';

@IonicPage()
@Component({
  selector: 'page-session-attendee-sheet',
  templateUrl: 'session-attendee-sheet.html',
})
export class SessionAttendeeSheetPage {

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
  attendees: any = [];
  attendeesMod: any;
  checkInTimes: any;
  eventListLocal: any;
  
  constructor(
      public navCtrl: NavController
    , public navParams: NavParams
    , public localDataService: LocalDataServiceProvider
    ) {
    //this.event = navParams.get("event");
    this.eventID = navParams.get("eventID");
    this.sessionID = navParams.get("sessionID");
  }

  ionViewDidLoad() {
    this.setFields();
  }

  setFields() {

    this.getEventListLocal();
    this.event = this.eventListLocal.find((obj) => {
      return obj.EventID == this.eventID;
    })

    console.log(this.event);

    this.eventName = this.event.EventName;    
    this.eventStart = this.event.EventStart;
    this.eventEnd = this.event.EventEnd;

    this.session = this.event.Sessions.find((obj) => {
      return obj.SessionID === this.sessionID;
    });
      
    console.log(this.session);

    this.checkInTimes = this.session.CheckInTimes;    

    this.session.SessionAttendees.forEach(attendee => {
      attendee.checkInTimes = JSON.parse(JSON.stringify(this.checkInTimes));

      for(var checkInTime of attendee.checkInTimes) {

        let attendanceRecord = this.session.SessionAttendanceRecords.find((obj) => {
          return obj.SessionCheckInTimeID === checkInTime.SessionCheckInTimeID && obj.PersonID == attendee.PersonID;
        })       

        console.log(attendanceRecord);

        if (attendanceRecord) {          
          checkInTime.checkIn = true;
        } else {
          checkInTime.checkIn = false;
        }
        
      }

      this.attendees.push(attendee);      
    });
    
    this.sessionName = this.session.SessionName;
    this.sessionStart = this.session.SessionStart;
    this.sessionEnd = this.session.SessionEnd;      
  }

  getEventListLocal() {
    this.eventListLocal = this.localDataService.eventListLocal;
  }

}

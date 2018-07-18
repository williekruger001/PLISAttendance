import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { AddEventPage } from '../add-event/add-event';
import { Network } from '@ionic-native/network';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { SessionPage } from '../session/session'
import { Storage } from '@ionic/storage';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { EventServiceProvider } from '../../providers/event-service/event-service'
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  isHiddenEmptyListMsg: boolean = true;
  isDisabledAddEvent: boolean = true;
  eventListLocal: any;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , public modalCtrl: ModalController
    , public network: Network
    , public localDataService: LocalDataServiceProvider
    , public loadingCtrl: LoadingController
    , public storage: Storage
    , public authenticatedUser: AuthenticatedUserProvider
    , public eventService: EventServiceProvider
  ) {

  }

  ionViewDidLoad() {

    this.getEventListLocal();

    if (this.checkNetwork()) {
      //Update the database with attendances
      this.updateAttendances();
      //Check if all attendances was uploaded
      //Remove events that are older than 7 days and all attendance set
    }
  }

  syncAttendance() {
    if (this.checkNetwork()) {
      this.updateAttendances();
    }
  }

  refreshEventDetails(index) {
    if (this.checkNetwork()) {
      this.updateAttendances();      
      this.localDataService.removeEventLocal(index);
      this.getEventListLocal();
    }

  }

  updateAttendances() {

    let env: string

    let loader = this.loadingCtrl.create({
      content: "Please wait while we update the database..."
    });

    loader.present();

    this.storage.get('_env').then((val) => {
      if (val) {
        env = val;
      } else {
        env = "prod"
      }

      //Loop throught event list and attendance records and update details

      //alert(this.eventListLocal.length);

      this.eventListLocal.forEach(event => {

        //alert(event.Sessions.length);

        event.Sessions.forEach(session => {

          //alert(session.SessionAttendanceRecords.length);
          //alert(this.authenticatedUser.user.UserID);
          session.SessionAttendanceRecords.forEach(attendanceRecord => {

            this.eventService.updateAttendance(attendanceRecord, env, session.SessionID, this.authenticatedUser.user.UserID).then((data) => {
              let sessionAttendance: any;
              sessionAttendance = data;
              sessionAttendance = sessionAttendance.d;

              if (sessionAttendance.Key != 0) {
                attendanceRecord.SessionAttendanceID = sessionAttendance.Key;
              }

              this.localDataService.saveEventListLocal(this.eventListLocal);

            }, (err) => {
              loader.dismiss();
              alert(err);
            });

          });

        });

      });

      //This will check that ALL attendances was synchronised and archive the event if all is done.

      this.eventListLocal.forEach(event => {

        //Check if the Event End Date is in the past

        let eventEnd = moment(event.EventEnd, 'DD-MM-YYYY hh:mm a');
        let dateNow = moment();

        if (moment(eventEnd).isBefore(dateNow)) {

          let noSyncCount: number = 0;

          event.Sessions.forEach(session => {

            session.SessionAttendanceRecords.forEach(attendanceRecord => {

              if (attendanceRecord.SessionAttendanceID == 0) noSyncCount++;

            });

          });

          //If the noSyncCount is 0 remove event from list and archive
          if (noSyncCount === 0) {

            let eventIndex = this.eventListLocal.findIndex(obj => obj.EventID == event.EventID);

            this.localDataService.addEventArchive(event);

            this.eventListLocal.splice(eventIndex);

            //this.eventListLocal.saveEventListLocal();

          }

          //Reset the counter
          noSyncCount = 0;

        }

      });

    });

    loader.dismiss();

  }

  getEventListLocal() {
    this.eventListLocal = this.localDataService.eventListLocal;
  }

  presentEventsModal() {
    this.navCtrl.push(AddEventPage);
  }

  getSessionDetails(event, sessionID) {
    this.navCtrl.push(SessionPage, {
      event: event,
      sessionID: sessionID
    });
  }

  checkNetwork() {

    this.network.onDisconnect().subscribe(() => {
      this.isDisabledAddEvent = true;
    });

    this.network.onConnect().subscribe(() => {
      this.isDisabledAddEvent = false;
    });

    if (this.network.type != 'none') {
      this.isDisabledAddEvent = false;
      return true;
    } else {
      this.isDisabledAddEvent = true;
      return false;
    }

  }
}

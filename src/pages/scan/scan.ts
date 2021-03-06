import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { GLSecureStorageProvider } from "gl-ionic2-secure-storage/dist/src";
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {

  scanSub: any;
  closeIcon: string = "barcode";
  flashIconColor: string = "";
  closeIconColor: string = "green";
  event: any;
  sessionID: any;
  sessionCheckInTimeID: any;
  session: any;
  eventID: any;
  eventName: string;
  eventStart: string;
  eventEnd: string;
  sessionName: string;
  sessionStart: string;
  sessionEnd: string;
  checkInTimes: any;
  sessionAttendanceRecords: any = [];
  sessionAttendanceRecordsDetailed: any = [];
  attendeeList: any = [];
  timeOutToast: any = 4000;
  timeOutScanner: any = 3500;
  checkInDate: any;
  startTime: any;
  endTime: any;
  scannerDisabled: boolean = true;
  isHiddenEmptyListMsg: boolean = true;

  constructor(
    public navCtrl: NavController
    , public navParams: NavParams
    , private qrScanner: QRScanner
    , public toastCtrl: ToastController
    , public localDataService: LocalDataServiceProvider    
    , public eventService: EventServiceProvider
    , public authenticatedUser: AuthenticatedUserProvider
    , private glSecureStorage: GLSecureStorageProvider
  ) {
    this.event = navParams.get("event");
    this.sessionID = navParams.get("sessionID");
    this.sessionCheckInTimeID = navParams.get("sessionCheckInTimeID");
  }

  ionViewDidLoad() {
    this.setFields();
  }

  calculateStartAndEndDates() {

    let checkInTimeObject = this.checkInTimes.find((obj) => {
      return obj.SessionCheckInTimeID === this.sessionCheckInTimeID;
    });

    let checkInTimeTolerance = this.session.CheckInTolerance;
    let checkInDateTime = moment(checkInTimeObject.CheckInTime, 'DD/MM/YYYY hh:mm:ss A');
    
    this.startTime = moment(checkInDateTime).subtract(checkInTimeTolerance, 'm').format('hh:mm a');
    this.endTime = moment(checkInDateTime).add(checkInTimeTolerance, 'm').format('hh:mm a');
    this.checkInDate = moment(checkInDateTime).format('DD MMMM YYYY');    

    let dateNow = moment();
    let startDateTime = moment(checkInDateTime).subtract(checkInTimeTolerance, 'm');
    let endDateTime = moment(checkInDateTime).add(checkInTimeTolerance, 'm');

    if (dateNow < startDateTime) {
      //alert(dateNow + " - " + checkInTime);
      let startMilliseconds = moment
        .duration(moment(startDateTime)
          .diff(moment(dateNow)))
        .asMilliseconds();

      let endMilliseconds = moment
        .duration(moment(endDateTime)
          .diff(moment(dateNow)))
        .asMilliseconds();

      setTimeout(() => this.scannerDisabled = false, startMilliseconds);
      setTimeout(() => {
        this.scannerDisabled = true;
        this.closeScanner();
      }, endMilliseconds);

    } else if (dateNow > startDateTime && dateNow < endDateTime) {

      this.scannerDisabled = false;

      let endMilliseconds = moment
        .duration(moment(endDateTime)
          .diff(moment(dateNow)))
        .asMilliseconds();

      setTimeout(() => {
        this.scannerDisabled = true;
        this.closeScanner();
      }, endMilliseconds);
    }

  }

  getEventListLocal() {
    return this.localDataService.eventListLocal;
  }

  setFields() {

    window.document.getElementById('divScanner').classList.add('hide'); //Hide the scanner box

    this.eventName = this.event.EventName;
    this.eventID = this.event.EventID;
    this.eventStart = this.event.EventStart;
    this.eventEnd = this.event.EventEnd;

    this.session = this.event.Sessions.find((obj) => {
      return obj.SessionID === this.sessionID;
    });
    
    this.sessionAttendanceRecordsDetailed = this.session.SessionAttendanceRecords.filter((obj) => {
      return obj.SessionCheckInTimeID == this.sessionCheckInTimeID;
    });

    this.sessionAttendanceRecordsDetailed.sort((a, b) => b.CheckInTime.localeCompare(a.CheckInTime));

    if (this.sessionAttendanceRecordsDetailed && this.sessionAttendanceRecordsDetailed.length > 0) {
      this.isHiddenEmptyListMsg = true;
    } else {
      this.isHiddenEmptyListMsg = false;
    }

    this.attendeeList = this.session.SessionAttendees;
    this.checkInTimes = this.session.CheckInTimes;

    this.sessionName = this.session.SessionName;
    this.sessionStart = this.session.SessionStart;
    this.sessionEnd = this.session.SessionEnd;

    this.calculateStartAndEndDates();
  }

  presentToast(msg: any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: this.timeOutToast,
      position: 'middle'
    });
    toast.present();
  }

  getAttendee(personID) {
    let attendee = this.attendeeList.find((obj) => {
      return obj.PersonID == personID;
    })
    return attendee;
  }

  processAttendance(personID: any) {

    let eventsList = this.getEventListLocal();
    let eventIndex = eventsList.findIndex(obj => obj.EventID == this.eventID);
    let sessionIndex = eventsList[eventIndex].Sessions.findIndex(obj => obj.SessionID == this.sessionID);

    let exist = eventsList[eventIndex].Sessions[sessionIndex].SessionAttendanceRecords.find((o, i) => {
      if (o.PersonID == personID && o.SessionCheckInTimeID == this.sessionCheckInTimeID) {
        return true;
      }
    });

    let attendee = this.getAttendee(personID);

    if (!exist) {
      if (attendee) {

        let attendanceRecord: any = {
          SessionAttendanceID: 0,
          SessionCheckInTimeID: this.sessionCheckInTimeID,
          CheckInTime: moment.utc().format(),
          CheckInTimeDisplay: new Date().toLocaleTimeString(),
          PersonID: personID,
          FullName: attendee.FullName,
          StaffNumber: attendee.StaffNumber
        }        

        this.sessionAttendanceRecordsDetailed.push(attendanceRecord);
        this.presentToast('Welcome ' + attendee.FullName + ' (' + attendee.StaffNumber + '). Your check-in was successful!')

        this.sessionAttendanceRecordsDetailed.sort((a, b) => b.CheckInTime.localeCompare(a.CheckInTime));

        eventsList[eventIndex].Sessions[sessionIndex].SessionAttendanceRecords.push(attendanceRecord);
        eventsList[eventIndex].Sessions[sessionIndex].SessionAttendanceRecordsDetailed = this.sessionAttendanceRecordsDetailed;        

        let env: string       

        this.glSecureStorage.get('_env').then((val) => {
          if (val) {
            env = JSON.parse(val);
          } else {
            env = "prod"
          }
          eventsList.forEach(event => {     
            event.Sessions.forEach(session => {              
              session.SessionAttendanceRecords.forEach(attendanceRecord => {

                this.eventService.updateAttendance(attendanceRecord, env, session.SessionID, this.authenticatedUser.user.UserID).then((data) => {
                  let sessionAttendance: any;
                  sessionAttendance = data;
                  sessionAttendance = sessionAttendance.d;

                  if (sessionAttendance.Key != 0) {
                    attendanceRecord.SessionAttendanceID = sessionAttendance.Key;
                  }

                  this.localDataService.saveEventListLocal(eventsList);

                }, (err) => {
                  //alert(err);
                });
              });
            });
          });
        });

        this.localDataService.saveEventListLocal(eventsList);
        this.setFields();

      } else {
        this.presentToast('This person is not registered in this session! Please contact the administrator.')
      }
    } else {
      if (attendee) {
        this.presentToast(attendee.FullName + ' (' + attendee.StaffNumber + '). You already checked-in!');
      } else {
        this.presentToast('This person is already checked-in!');
      }
    }
  }

  startQRScanner() {

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted  

          // start scanning
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {

            var audio = new Audio('assets/audio/beep.mp3');
            audio.play();

            this.processAttendance(text);

            this.qrScanner.hide(); // hide camera preview

            window.document.getElementById('divDetails').classList.remove('hide');
            window.document.getElementById('divScanner').classList.add('hide');
            window.document.querySelector('ion-app').classList.remove('transparent-body');
            this.scanSub.unsubscribe(); // stop scanning

            setTimeout(() => this.startQRScanner(), this.timeOutScanner); // Start the scanner again

          });

          // show camera preview
          this.qrScanner.show();
          window.document.getElementById('divDetails').classList.add('hide');
          window.document.getElementById('divScanner').classList.remove('hide');
          window.document.querySelector('ion-app').classList.add('transparent-body');


          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          this.qrScanner.openSettings();
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => alert('Error is: ' + e));
  }

  toggleCamera() {

    this.qrScanner.getStatus().then(status => {
      let qrStatus: QRScannerStatus = status;

      if (qrStatus.showing) {
        if (qrStatus.currentCamera === 0) {
          this.qrScanner.useCamera(1);
        } else {
          this.qrScanner.useCamera(0);
        }
      }
    });

  }

  toggleView() {

    this.qrScanner.getStatus().then(status => {
      let qrStatus: QRScannerStatus = status;

      if (qrStatus.showing) {
        this.qrScanner.hide();
        this.scanSub.unsubscribe();
        this.qrScanner.destroy().then(status => {
          this.closeIcon = "barcode";
          this.closeIconColor = "green";
          window.document.querySelector('ion-app').classList.remove('transparent-body');
          window.document.getElementById('divDetails').classList.remove('hide');
          window.document.getElementById('divScanner').classList.add('hide');
        });
      } else {
        this.startQRScanner();
        this.closeIcon = "close";
        this.closeIconColor = "danger";
      }
    });
  }

  toggleFlash() {

    this.qrScanner.getStatus().then(status => {
      let qrStatus: QRScannerStatus = status;

      if (qrStatus.showing) {
        if (qrStatus.lightEnabled) {
          this.qrScanner.disableLight();
          this.flashIconColor = "";
        } else {
          this.qrScanner.enableLight();
          this.flashIconColor = "orange";
        }
      }
    });
  }

  ionViewDidLeave() {
    this.closeScanner();
  }

  closeScanner() {
    this.qrScanner.hide();
    this.scanSub.unsubscribe();
    this.closeIcon = "barcode";
    this.closeIconColor = "green";
    window.document.querySelector('ion-app').classList.remove('transparent-body');
  }

}

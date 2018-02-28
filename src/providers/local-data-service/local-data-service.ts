import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import moment from 'moment';


@Injectable()
export class LocalDataServiceProvider {

  EVENT_LIST_LOCAL: string = "_eventListLocal";
  EVENT_LIST_ARCHIVE: string = "_eventListArchive";
  eventListLocal: any = [];
  eventListArchive: any = [];

  constructor(
    public storage: Storage
  ) { }

  getEventListLocal() {

    let env: string = "";

    this.storage.get('_env').then((val) => {
      if (val) {
        env = val;
      } else {
        env = "prod"
      }

      this.storage.get(this.EVENT_LIST_LOCAL + env).then((val) => {
        if (val) {
          this.eventListLocal = val;
        }
      });

    });

  }

  addEventLocal(event: any) {

    let env: string = "";

    this.storage.get('_env').then((val) => {
      if (val) {
        env = val;
      } else {
        env = "prod"
      }

      let exist = this.eventListLocal.find((o, i) => {
        if (o.EventID == event.EventID) {
          return true;
        }
      });

      if (!exist) {

        //First update any CheckIn times with moment

        event.Sessions.forEach(session => {

          session.SessionAttendanceRecords.forEach(attendanceRecord => {

            attendanceRecord.CheckInTime = moment(attendanceRecord.CheckInTime);

          });

        });

        this.eventListLocal.push(event);
        this.storage.set(this.EVENT_LIST_LOCAL + env, this.eventListLocal);
      }

    });

  }

  addEventArchive(event: any) {

    let env: string = "";

    this.storage.get('_env').then((val) => {
      if (val) {
        env = val;
      } else {
        env = "prod"
      }

      let exist = this.eventListArchive.find((o, i) => {
        if (o.EventID == event.EventID) {
          return true;
        }
      });

      if (!exist) {
        this.eventListArchive.push(event);
        this.storage.set(this.EVENT_LIST_ARCHIVE + env, this.eventListArchive);
      }

    });

  }

  saveEventListLocal(eventList: any) {
    let env: string = "";

    this.storage.get('_env').then((val) => {
      if (val) {
        env = val;
      } else {
        env = "prod"
      }

      this.storage.set(this.EVENT_LIST_LOCAL + env, eventList);

    });
  }

}

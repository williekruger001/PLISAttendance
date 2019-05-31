import { Injectable } from '@angular/core';
//import moment from 'moment';
import {GLSecureStorageProvider} from "gl-ionic2-secure-storage/dist/src";

@Injectable()
export class LocalDataServiceProvider {

  EVENT_LIST_LOCAL: string = "_eventListLocal";
  EVENT_LIST_ARCHIVE: string = "_eventListArchive";
  eventListLocal: any = [];
  eventListArchive: any = [];

  constructor(
    private glSecureStorage: GLSecureStorageProvider
  ) { }

  getEventListLocal() {

    let env: string = "";

    this.glSecureStorage.get('_env').then((val) => {
      if (val) {
        env = JSON.parse(val);
      } else {
        env = "prod"
      }

      this.glSecureStorage.get(this.EVENT_LIST_LOCAL + env).then((val) => {
        if (val) {          
          this.eventListLocal = JSON.parse(val);
        }
      });
    });
  }

  removeEventLocal(index) {
    let env: string = "";

    this.glSecureStorage.get('_env').then((val) => {
      if (val) {
        env = JSON.parse(val);
      } else {
        env = "prod"
      }

      this.eventListLocal.splice(index, 1);
      this.glSecureStorage.set(this.EVENT_LIST_LOCAL + env, JSON.stringify(this.eventListLocal));
    });
  }

  addEventLocal(event: any) {

    let env: string = "";

    this.glSecureStorage.get('_env').then((val) => {
      if (val) {
        env = JSON.parse(val);
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

        // event.Sessions.forEach(session => {
        //   session.SessionAttendanceRecords.forEach(attendanceRecord => {
        //     attendanceRecord.CheckInTime = moment(attendanceRecord.CheckInTime);
        //   });
        // });

        this.eventListLocal.push(event);
        this.glSecureStorage.set(this.EVENT_LIST_LOCAL + env, JSON.stringify(this.eventListLocal));
      }
    });
  }

  addEventArchive(event: any) {

    let env: string = "";

    this.glSecureStorage.get('_env').then((val) => {
      if (val) {
        env = JSON.parse(val);
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
        this.glSecureStorage.set(this.EVENT_LIST_ARCHIVE + env, JSON.stringify(this.eventListArchive));
      }
    });
  }

  saveEventListLocal(eventList: any) {
    let env: string = "";

    this.glSecureStorage.get('_env').then((val) => {
      if (val) {
        env = JSON.parse(val);
      } else {
        env = "prod"
      }
      this.glSecureStorage.set(this.EVENT_LIST_LOCAL + env, JSON.stringify(eventList));
    });
  }
}

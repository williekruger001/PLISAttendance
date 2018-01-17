import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class LocalDataServiceProvider {

  EVENT_LIST_LOCAL: string = "_eventListLocal";
  eventListLocal: any = [];

  constructor(
    public storage: Storage
  ) { }

  getEventListLocal() {

    this.storage.get(this.EVENT_LIST_LOCAL).then((val) => {
      if (val) {
        this.eventListLocal = val;
      }
    });
  }

  addEventLocal(event: any) {
    let exist = this.eventListLocal.find((o, i) => {
      if (o.EventID == event.EventID) {
        return true;
      }
    });

    if (!exist) {
      this.eventListLocal.push(event);
      this.storage.set(this.EVENT_LIST_LOCAL, this.eventListLocal);
    }
  }

  saveEventListLocal(eventList: any) {
    this.storage.set(this.EVENT_LIST_LOCAL, eventList);
  }

}

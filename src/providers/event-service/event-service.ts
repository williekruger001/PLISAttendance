//import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EventServiceProvider {

  eventList: any

  constructor(
    public http: Http
  ) { }

  getEvents() {

    return new Promise((resolve, reject) => {

      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json; charset=utf-8');
      let options = new RequestOptions({ headers: headers });

      let postParams = {
        _orgID: '1',
        _bypass: 'False'
      }

      this.http.post("https://plis-admin-test.det.wa.edu.au/webapi/PLISAppEvents.asmx/GetAttendanceEvents", postParams, options)
        .subscribe(data => {
          console.log(data['_body'].d);
          resolve(data['_body'].d);
        }, error => {
          reject(error);// Error getting the data
        });

    });

  }

}

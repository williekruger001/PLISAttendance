import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { Storage } from '@ionic/storage';
//import moment from 'moment';

@Injectable()
export class EventServiceProvider {



  constructor(
    public httpClient: HttpClient
    , public authenticatedUser: AuthenticatedUserProvider
    , public storage: Storage) {

  }

  getEvents(env) {

    let headers = new HttpHeaders();
    headers.append('content-type', 'application/json; charset=utf-8');

    if (this.authenticatedUser.user.Org_Selected == 99999) {
      this.authenticatedUser.user.Org_Selected = 0;
    }

    let bypass: string = (this.authenticatedUser.user.Org_Selected == 0) ? 'true' : 'false'
    let body = {
      _orgID: this.authenticatedUser.user.Org_Selected,
      _bypass: bypass
    };

    let baseUrl: string = this.authenticatedUser.getEnvironment(env).url; //'https://plis-admin-test.det.wa.edu.au/webapi/'
    let apiMethod: string = 'PLISAppEvents.asmx/GetAttendanceEvents';

    return new Promise((resolve, reject) => {
      this.httpClient.post(baseUrl + apiMethod, body, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, (err: HttpErrorResponse) => {
          console.log(err.message);
          console.log(err.status);
          console.log(err.statusText);
          console.log(err.ok);
          reject(err.message);
        });
    });

  }

  updateAttendance(attendeeRecord: any, env: string, sessionID: any, lastUpdatedBy: string) {

    let headers = new HttpHeaders();
    headers.append('content-type', 'application/json; charset=utf-8');

    //alert("sessionCheckInTimeID: " + attendeeRecord.SessionCheckInTimeID);
    //alert("checkInTime: " + attendeeRecord.CheckInTime);
    //alert("personID: " + attendeeRecord.PersonID);
    //alert("sessionID: " + sessionID);
    //alert("lastUpdatedBy: " + lastUpdatedBy);

    let body = {
      _sessionCheckInTimeID: attendeeRecord.SessionCheckInTimeID,
      _checkInTime: attendeeRecord.CheckInTime,
      _personID: attendeeRecord.PersonID,
      _sessionID: sessionID,
      _lastUpdatedBy: lastUpdatedBy
    };

    let baseUrl: string = this.authenticatedUser.getEnvironment(env).url; //'https://plis-admin-test.det.wa.edu.au/webapi/'
    let apiMethod: string = 'PLISAppEvents.asmx/UpdateAttendance';

    //alert(baseUrl + apiMethod);

    return new Promise((resolve, reject) => {
      this.httpClient.post(baseUrl + apiMethod, body, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, (err: HttpErrorResponse) => {
          console.log(err.message);
          console.log(err.status);
          console.log(err.statusText);
          console.log(err.ok);
          reject(err.message);
        });
    });

  }

}

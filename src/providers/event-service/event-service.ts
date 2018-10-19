import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';

@Injectable()
export class EventServiceProvider {

  constructor(
    public httpClient: HttpClient
    , public authenticatedUser: AuthenticatedUserProvider    
    ) {
  }

  getEvents(env) {

    let headers = new HttpHeaders()
      .set('content-type', 'application/json; charset=utf-8')
      .set('staffNumber', this.authenticatedUser.user.UserID)
      .set('token', this.authenticatedUser.user.Token);   

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
          reject('Status code: ' + err.status + ' - ' + err.statusText);
        });
    });

  }

  updateAttendance(attendeeRecord: any, env: string, sessionID: any, lastUpdatedBy: string) {

    let headers = new HttpHeaders()
      .set('content-type', 'application/json; charset=utf-8')
      .set('staffNumber', this.authenticatedUser.user.UserID)
      .set('token', this.authenticatedUser.user.Token);    

    let body = {
      _sessionCheckInTimeID: attendeeRecord.SessionCheckInTimeID,
      _checkInTime: attendeeRecord.CheckInTime,
      _personID: attendeeRecord.PersonID,
      _sessionID: sessionID,
      _lastUpdatedBy: lastUpdatedBy
    };

    let baseUrl: string = this.authenticatedUser.getEnvironment(env).url; //'https://plis-admin-test.det.wa.edu.au/webapi/'
    let apiMethod: string = 'PLISAppEvents.asmx/UpdateAttendance';
   
    return new Promise((resolve, reject) => {
      this.httpClient.post(baseUrl + apiMethod, body, { headers: headers })
        .subscribe(data => {
          resolve(data);
        }, (err: HttpErrorResponse) => {          
          reject('Status code: ' + err.status + ' - ' + err.statusText);
        });
    });

  }

}

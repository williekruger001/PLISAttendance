import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatedUserProvider } from '../../providers/authenticated-user/authenticated-user';
import { Storage } from '@ionic/storage';

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
        }, (err) => {
          reject(err.message);
        });
    });

  }

}

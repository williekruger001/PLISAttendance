import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable()

export class AuthenticatedUserProvider {

  ENV_ARRAY: string = '_envArray';

  user: any;
  envArray: any = [];

  constructor(
    public storage: Storage,
    public httpClient: HttpClient
  ) { }

  getEnvironments() {

    return new Promise((resolve, reject) => {

      this.storage.get(this.ENV_ARRAY).then((val) => {
        if (val) {
          this.envArray = [];
          this.envArray = val;
          resolve(this.envArray);
        } else {
          this.envArray = [];
          //TO DO: Put these parameters in the PLIS database for initialisation of app and default restore
          this.envArray.push({ name: 'Production', value: 'prod', url: 'https://plis-admin.det.wa.edu.au/webapi/' });
          this.envArray.push({ name: 'Training', value: 'train', url: 'https://plis-admin-training.det.wa.edu.au/webapi/' });
          this.envArray.push({ name: 'Test', value: 'test', url: 'https://plis-admin-test.det.wa.edu.au/webapi/' });
          this.storage.set(this.ENV_ARRAY, this.envArray);
          resolve(this.envArray);
        }
      })
    });
  }

  getEnvironment(env) {
    let result: any = this.envArray.filter((o) => { return o.value == env; });
    return result ? result[0] : null;
  }

  getUser(userid, env, token) {

    let headers = new HttpHeaders()
      .set('content-type', 'application/json; charset=utf-8')
      .set('staffNumber', userid)
      .set('token', token);    
    
    let body = {
      _userID: userid
    };

    let baseUrl: string = this.getEnvironment(env).url; //'https://plis-admin-test.det.wa.edu.au/webapi/'
    let apiMethod: string = 'PLISAppEvents.asmx/GetUser';

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

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()

export class AuthenticatedUserProvider {

  ENV_ARRAY: string = '_envArray';

  user: any;
  envArray: any = [];

  constructor(
    public storage: Storage
  ) { }

  getEnvironments() {

    return new Promise((resolve, reject) => {

      this.storage.get(this.ENV_ARRAY).then((val) => {
        if (val) {
          this.envArray = val;
          resolve(this.envArray);
        } else {
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

}

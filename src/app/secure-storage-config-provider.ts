import {Injectable} from '@angular/core';

@Injectable()
export class MySecureStorageConfigProvider {

  constructor() {
  }

  // override this function to set a namespace
  public getNamespace(): string {
    return 'PLISDB';
  }
}

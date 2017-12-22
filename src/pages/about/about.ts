import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {

  appName: any;
  packageName: any;
  versionCode: any;
  versionNumber: any;

  constructor(public navCtrl: NavController, public appVersion: AppVersion) {

  }

  ionViewDidLoad() {

    this.getVersionInfo();

  }

getVersionInfo() {

this.appVersion.getPackageName().then(data => {
  if (data){
    this.packageName = data;
  } else {
    this.packageName = "Not available.";
  }
});

this.appVersion.getAppName().then(data => {
  if (data) {
    this.appName = data;
  } else {
    this.appName = "Not available."
  }  
});

this.appVersion.getVersionCode().then(data => {
  if (data) {
    this.versionCode = data;
  } else {
    this.versionCode = "Not available."
  }  
});

this.appVersion.getVersionNumber().then(data => {
  if (data) {
    this.versionNumber = data;
  } else {
    this.versionNumber = "Not available."
  }  
});

console.log(this.appName);

}

}

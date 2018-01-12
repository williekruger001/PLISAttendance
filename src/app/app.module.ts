import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { EventsPage } from '../pages/events/events'
import { AddEventPage } from '../pages/add-event/add-event'
import { SessionPage } from '../pages/session/session'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Network } from '@ionic-native/network'

import { SQLite } from '@ionic-native/sqlite';

import { QRScanner } from '@ionic-native/qr-scanner';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

import { IonicStorageModule } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AppVersion } from '@ionic-native/app-version';
import { AuthenticatedUserProvider } from '../providers/authenticated-user/authenticated-user';
import { EventServiceProvider } from '../providers/event-service/event-service';
import { HttpClientModule } from '@angular/common/http';
import { LocalDataServiceProvider } from '../providers/local-data-service/local-data-service';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    EventsPage,
    AddEventPage,
    SessionPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '_plisDB'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    EventsPage,
    AddEventPage,
    SessionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    SQLite,    
    QRScanner,
    FingerprintAIO,
    InAppBrowser,
    AppVersion,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticatedUserProvider,
    EventServiceProvider,
    LocalDataServiceProvider
  ]
})
export class AppModule {}

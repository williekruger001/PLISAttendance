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
import { ScanPage } from '../pages/scan/scan'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Network } from '@ionic-native/network'

import { SQLite } from '@ionic-native/sqlite';

import { QRScanner } from '@ionic-native/qr-scanner';

//import { IonicStorageModule } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AppVersion } from '@ionic-native/app-version';
import { AuthenticatedUserProvider } from '../providers/authenticated-user/authenticated-user';
import { EventServiceProvider } from '../providers/event-service/event-service';
import { HttpClientModule } from '@angular/common/http';
import { LocalDataServiceProvider } from '../providers/local-data-service/local-data-service';
import { GLSecureStorageProvider } from 'gl-ionic2-secure-storage/dist/src';
import { GLSecureStorageConfigProvider } from 'gl-ionic2-secure-storage/dist/src';
import { MySecureStorageConfigProvider } from '../app/secure-storage-config-provider';
import { GlIonic2SecureStorageModule } from 'gl-ionic2-secure-storage/dist/src';



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
    SessionPage,
    ScanPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    GlIonic2SecureStorageModule.forRoot(),   
    IonicModule.forRoot(MyApp)
    /* IonicStorageModule.forRoot({
      name: '_plisDB'
    }) */
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
    SessionPage,
    ScanPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    SQLite,    
    QRScanner,    
    InAppBrowser,
    AppVersion,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticatedUserProvider,
    EventServiceProvider,
    LocalDataServiceProvider,
    GLSecureStorageProvider,
    {provide: GLSecureStorageConfigProvider, useClass: MySecureStorageConfigProvider }   
  ]
})
export class AppModule {}

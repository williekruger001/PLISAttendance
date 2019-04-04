import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SessionAttendeeSheetPage } from './session-attendee-sheet';

@NgModule({
  declarations: [
    SessionAttendeeSheetPage,
  ],
  imports: [
    IonicPageModule.forChild(SessionAttendeeSheetPage),
  ],
})
export class SessionAttendeeSheetPageModule {}

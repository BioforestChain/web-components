import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BnWebComponentModule } from 'lib';

@NgModule({
  declarations: [AppComponent],
  imports: [
    //
    BrowserModule,
    BnWebComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

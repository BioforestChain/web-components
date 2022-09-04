import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CccWebComponentModule } from '@ccchain/web-component-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    //
    BrowserModule,
    CccWebComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

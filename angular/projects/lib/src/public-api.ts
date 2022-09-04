/*
 * Public API Surface of lib
 */

export * from './service/bn-web-component.service';

import { NgModule } from '@angular/core';
import { DIRECTIVES } from './directives/index';
export * from './directives/proxies';
import { defineCustomElements } from '@bnqkl/web-component';

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
})
export class BnWebComponentModule {
  constructor() {
    defineCustomElements();
  }
}

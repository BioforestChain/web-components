import { NgModule } from "@angular/core";
import { DIRECTIVES } from "./directives/index";
export * from "./directives/proxies";
import { defineCustomElements } from "@ccchain/web-component";

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
})
export class CccWebComponentModule {
  constructor() {
    defineCustomElements();
  }
}

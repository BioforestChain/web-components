import { Component, ComponentInterface, Element, h, Host, Prop } from "@stencil/core";
import { Logger } from "../../utils/utils";

let tabsIdAcc = 0;

@Component({
  tag: "ccc-top-tabs-menu",
  styleUrl: "ccc-top-tabs-menu.scss",
  shadow: true,
})
export class CccTopTabsMenu implements ComponentInterface {
  private readonly _tabs_id = `top-tabs-menu-${tabsIdAcc++}`;
  @Prop() forSlider?: string;
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  render() {
    return (
      <Host>
        <ccc-slider-tabs id={this._tabs_id} class="sub-tab" for-slider={this.forSlider}>
          <slot name="tab" slot="tab"></slot>
          <ccc-slider-scrollbar
            part="scrollbar"
            for-slider={this.forSlider || this._tabs_id}
            for-layout={this._tabs_id}
            exportparts="cursor, spirit"
          ></ccc-slider-scrollbar>
        </ccc-slider-tabs>
      </Host>
    );
  }
}

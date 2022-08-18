import { Component, ComponentInterface, Element, h, Host, Method, Prop } from "@stencil/core";
import { Logger, querySelector } from "../../utils/utils";
import { $CccLayout, $CccSliderFollower } from "../slider/ccc-slider.const";

let tabsIdAcc = 0;

@Component({
  tag: "ccc-top-tabs-menu",
  styleUrl: "ccc-top-tabs-menu.scss",
  shadow: true,
})
export class CccTopTabsMenu implements ComponentInterface, $CccSliderFollower {
  private readonly _tabs_id = `top-tabs-menu-${tabsIdAcc++}`;
  @Prop() forSlider?: string;

  @Method()
  async bindSliderElement(ele?: HTMLElement | null) {
    this._tabsEle.bindSliderElement(ele);
  }

  private _tabsEle!: $CccLayout.HTMLCccLayoutElement & $CccSliderFollower;
  async componentDidLoad() {
    this._tabsEle = querySelector(this.hostEle.shadowRoot, ":scope > .tabs")!;
  }

  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  render() {
    return (
      <Host>
        <ccc-slider-tabs id={this._tabs_id} part="tabs" class="sub-tab" for-slider={this.forSlider}>
          <slot name="tab" slot="tab"></slot>
        </ccc-slider-tabs>
        <ccc-slider-scrollbar
          part="scrollbar"
          for-slider={this.forSlider || this._tabs_id}
          for-layout={this._tabs_id}
          exportparts="cursor, spirit"
        ></ccc-slider-scrollbar>
      </Host>
    );
  }
}

import { Component, ComponentInterface, Element, h, Host, Method, Prop } from "@stencil/core";
import { Logger, querySelector } from "../../utils/utils";
import { $BnLayout, $BnSliderFollower } from "../slider/bn-slider.const";

let tabsIdAcc = 0;

@Component({
  tag: "bn-top-tabs-menu",
  styleUrl: "bn-top-tabs-menu.scss",
  shadow: true,
})
export class BnTopTabsMenu implements ComponentInterface, $BnSliderFollower {
  private readonly _tabs_id = `top-tabs-menu-${tabsIdAcc++}`;
  @Prop() forSlider?: string;

  @Method()
  async bindSliderElement(ele?: HTMLElement | null) {
    this._tabsEle.bindSliderElement(ele);
  }

  private _tabsEle!: $BnLayout.HTMLBnLayoutElement & $BnSliderFollower;
  async componentDidLoad() {
    this._tabsEle = querySelector(this.hostEle.shadowRoot, ":scope > .tabs")!;
  }

  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  render() {
    return (
      <Host>
        <bn-slider-tabs id={this._tabs_id} part="tabs" class="tabs" for-slider={this.forSlider}>
          <slot name="tab" slot="tab"></slot>
        </bn-slider-tabs>
        <bn-slider-scrollbar
          part="scrollbar"
          for-slider={this.forSlider || this._tabs_id}
          for-layout={this._tabs_id}
          exportparts="cursor, spirit"
        ></bn-slider-scrollbar>
      </Host>
    );
  }
}

import { Component, ComponentInterface, Element, h, Host, Method, Prop } from "@stencil/core";
import { Logger } from "../../utils/utils";
import { $BnLayout, $BnSliderFollower } from "../slider/bn-slider.const";
import { QueryHelper } from "../util/query.helper";

let tabsIdAcc = 0;

@Component({
  tag: "bn-top-tabs-menu",
  styleUrl: "bn-top-tabs-menu.scss",
  shadow: true,
})
export class BnTopTabsMenu implements ComponentInterface, $BnSliderFollower {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  private readonly _tabs_id = `top-tabs-menu-${tabsIdAcc++}`;
  @Prop() forSlider?: string;

  @Method()
  async bindSliderElement(ele?: HTMLElement | null) {
    this._tabsEle?.bindSliderElement(ele);
  }

  private _tabsQueryHelper = new QueryHelper<$BnLayout.HTMLBnLayoutElement & $BnSliderFollower>(
    this.hostEle,
    ":scope > .tabs",
  );

  private get _tabsEle() {
    return this._tabsQueryHelper.lastOne;
  }
  async componentDidLoad() {
    this._tabsQueryHelper.componentDidLoad();
  }

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

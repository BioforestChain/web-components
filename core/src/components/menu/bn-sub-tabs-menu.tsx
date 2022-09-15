import { Component, ComponentInterface, Element, h, Host, Method, Prop, State } from "@stencil/core";
import { Logger, throttle } from "../../utils/utils";
import { $BnLayout, $BnSliderFollower } from "../slider/bn-slider.const";
import { QueryHelper } from "../util/query.helper";

@Component({
  tag: "bn-sub-tabs-menu",
  styleUrl: "bn-sub-tabs-menu.scss",
  shadow: true,
})
export class BnSubTabsMenu implements ComponentInterface, $BnSliderFollower {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  @Prop({}) forSlider?: string;
  @Method()
  async bindSliderElement(ele?: HTMLElement | null) {
    this._tabsEle?.bindSliderElement(ele);
  }

  @State() enableMask = false;
  @State() enableStartMask = false;
  @State() enableEndMask = false;

  private _tabsQueryHelper = new QueryHelper<$BnLayout.HTMLBnLayoutElement & $BnSliderFollower>(
    this.hostEle,
    ":scope > .tabs",
  );
  private get _tabsEle() {
    return this._tabsQueryHelper.lastOne;
  }
  async componentDidLoad() {
    this._tabsQueryHelper.componentDidLoad();
    this._updateMaskState();
  }

  @throttle(500)
  private _updateMaskState(/* tabsLayoutInfo = this._tabsLayoutInfo */) {
    const tabsEle = this._tabsEle;
    if (!tabsEle) {
      return;
    }

    this.console.log("updateMaskState");
    const { offsetWidth, scrollWidth } = tabsEle;
    if (offsetWidth < scrollWidth) {
      const { scrollLeft } = tabsEle;
      this.enableMask = true;
      const threshould = 10 * devicePixelRatio;
      this.enableStartMask = scrollLeft > threshould;
      this.enableEndMask = scrollLeft + offsetWidth + threshould < scrollWidth;
    } else {
      this.enableMask = false;
    }
  }

  onTabsLayoutChange = (event: CustomEvent<$BnLayout.LayoutChangeDetail>) => {
    if (event.target !== this._tabsEle) {
      return;
    }
    this._updateMaskState();
  };
  onTabsScroll = (event: Event) => {
    if (event.target !== this._tabsEle) {
      return;
    }
    this._updateMaskState();
  };

  scrollToStart = () => {
    const tabsEle = this._tabsEle;
    tabsEle?.scrollTo({ left: tabsEle.scrollLeft - tabsEle.offsetWidth / 2, behavior: "smooth" });
  };
  scrollToEnd = () => {
    const tabsEle = this._tabsEle;
    tabsEle?.scrollTo({ left: tabsEle.scrollLeft + tabsEle.offsetWidth / 2, behavior: "smooth" });
  };

  render() {
    return (
      <Host>
        <button
          class={{ mask: true, start: true, show: this.enableMask && this.enableStartMask }}
          onClick={this.scrollToStart}
          part="mask-start"
          aria-label="scroll to start"
        ></button>
        <bn-slider-tabs
          class="tabs"
          forSlider={this.forSlider}
          part="tabs"
          onLayoutChange={this.onTabsLayoutChange}
          onScroll={this.onTabsScroll}
          /* @ts-ignore */
          onScrollEnd={this.onTabsScroll}
        >
          <slot slot="tab" name="tab"></slot>
        </bn-slider-tabs>
        <button
          class={{ mask: true, end: true, show: this.enableMask && this.enableEndMask }}
          onClick={this.scrollToEnd}
          part="mask-end"
          aria-label="scroll to end"
        ></button>
      </Host>
    );
  }
}

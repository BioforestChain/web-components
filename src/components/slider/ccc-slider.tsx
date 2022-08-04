import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
  Event,
  EventEmitter,
  Watch,
  Method,
} from "@stencil/core";
import { at, Logger, querySelectorAll, throttle } from "../../utils/utils";

let console!: Logger;
@Component({
  tag: "ccc-slider",
  styleUrl: "ccc-slider.scss",
  shadow: true,
})
export class CccSlider implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly logger = (console = new Logger(this.hostEle));
  //#region 与tabs节点的联动
  get id() {
    return this.hostEle.id;
  }

  private _tabs: HTMLCccSliderTabsElement[] = [];
  private _bindingTabs() {
    if (this.id) {
      for (const tabsEle of (this._tabs = querySelectorAll<HTMLCccSliderTabsElement>(
        document,
        `ccc-silder-tabs[for=${this.id}]`,
      ))) {
        tabsEle.bindForElement(this.hostEle); // 绑定
      }
    }
  }
  private _unbindTabs() {
    for (const tabsEle of this._tabs) {
      tabsEle.bindForElement(null); // 解绑
    }
  }

  /**
   * watch id changed
   */
  private _mutationOb = new MutationObserver(entries => {
    if (this._inDOM) {
      for (const entry of entries) {
        if (entry.type === "attributes") {
          this._unbindTabs();
          this._bindingTabs();
        } else if (entry.type === "childList") {
          this._querySliderEles();
        }
      }
    }
  });

  private _inDOM = false;
  connectedCallback() {
    this._inDOM = true;
    this._bindingTabs();
    this._mutationOb.observe(this.hostEle, {
      attributeFilter: ["id"],
      attributes: true,
      childList: true,
    });
  }
  componentDidLoad() {
    this._querySliderEles();
    this._setActivedIndex(Number.isNaN(this._activedIndex) ? this.defaultActivedIndex : this._activedIndex);
  }

  disconnectedCallback() {
    this._inDOM = false;
    this._unbindTabs();
    this._mutationOb.disconnect();
  }
  //#endregion

  private _sliderEles: HTMLElement[] = [];
  public get sliderEles(): HTMLElement[] {
    return this._sliderEles;
  }
  public set sliderEles(value: HTMLElement[]) {
    this._sliderEles = value;
    console.info("set sliderEles", value);
    this._updateSliderStates();
  }
  private _querySliderEles() {
    this.sliderEles = querySelectorAll<HTMLElement>(this.hostEle, `:scope > [slot="slider"]`);
  }
  @Prop({ reflect: true }) defaultActivedIndex?: number;
  @Prop({ reflect: true }) activedIndex?: number;
  @Watch("activedIndex")
  watchActivedIndex(newVal: number) {
    this._setActivedIndex(newVal);
  }
  private _activedIndex = NaN;
  @Method()
  async getActivedIndex() {
    return this._activedIndex;
  }
  private _setActivedIndex(activedIndex?: number, behavior: ScrollBehavior = "smooth") {
    if (activedIndex === undefined) {
      return;
    }
    const ele = at(this._sliderEles, activedIndex, true);
    console.info("setActivedIndex", activedIndex, ele);
    if (ele) {
      this._inScrollInto = true;
      const scrollLeft = ele.offsetLeft - this.hostEle.offsetLeft;
      this.hostEle.scrollTo({ left: scrollLeft, behavior });
    }
  }
  @Method()
  async setActivedIndex(activedIndex: number) {
    this._setActivedIndex(activedIndex);
  }
  /**兼容ionic-sliders的语法 */
  @Method()
  async slideTo(activedIndex: number, behavior?: ScrollBehavior) {
    this._setActivedIndex(activedIndex, behavior);
  }
  @Method()
  async update() {
    this._querySliderEles();
  }

  @Event() activedSilderChange!: EventEmitter<[sliderEle: HTMLElement, activedIndex: number, isInControll: boolean]>;

  private _preSliderEles?: HTMLElement[];
  private _preActivedSlider?: HTMLElement;
  /**
   * 通知slider-ele的状态变更
   * 更新activedIndex的值变更
   * 触发activedSilderChange事件
   */
  @throttle(100)
  private async _updateSliderStates(layoutInfo = this._findSliderFrameLayoutInfo()) {
    console.info("updateSliderStates", "this._inScrollInto:", this._inScrollInto);
    const { closestSlider, viewboxCenter } = layoutInfo;
    if (this._preSliderEles !== this.sliderEles || this._preActivedSlider !== closestSlider.ele) {
      this._preActivedSlider = closestSlider.ele;
      this._preSliderEles = this.sliderEles;
      for (const sliderEle of this.sliderEles) {
        if (sliderEle !== closestSlider.ele) {
          sliderEle.removeAttribute("data-ccc-slider");
        } else {
          sliderEle.setAttribute("data-ccc-slider", "actived");
        }
      }
    }

    // if (this._inScrollInto === false || changed) {
    /// 计算出 activedIndex
    const progress = (viewboxCenter - closestSlider.center) / closestSlider.width;
    const activedIndex = (this._activedIndex = this._sliderEles.indexOf(closestSlider.ele!) + progress);
    this.activedSilderChange.emit([closestSlider.ele!, activedIndex, this._inScrollInto === false]);
    // }
  }
  /**
   * 获取这一帧的布局信息
   * @returns
   */
  private _findSliderFrameLayoutInfo() {
    const { offsetLeft: viewboxScrollLeft, offsetWidth: viewboxWidth, scrollLeft } = this.hostEle;
    const viewboxCenter = viewboxScrollLeft + viewboxWidth / 2 + scrollLeft;

    let closestSlider = {
      ele: undefined as HTMLElement | undefined,
      left: 0,
      width: 0,
      center: 0,
    };
    /// 从左往右，寻找中线现在进入到哪一个视图中
    for (const sliderEle of this.sliderEles) {
      const { offsetLeft, offsetWidth } = sliderEle;
      const offsetRight = offsetLeft + offsetWidth;

      if (offsetLeft <= viewboxCenter && viewboxCenter <= offsetRight) {
        const { offsetWidth } = sliderEle;
        closestSlider = {
          ele: sliderEle,
          left: offsetLeft,
          width: offsetWidth,
          center: offsetLeft + offsetWidth / 2,
        };
        break;
      }
    }
    return { closestSlider, viewboxCenter, viewboxScrollLeft, viewboxWidth };
  }

  //#region 滚动控制

  private _inScrollInto = false;
  /**
   * 在滚动停下的时候，强制滚动确保进入到卡片中
   */
  private _handleScrollStop() {
    console.success("scroll stop");
    const { closestSlider, viewboxCenter, viewboxWidth } = this._findSliderFrameLayoutInfo();
    console.info("closestSlider:", closestSlider);
    if (closestSlider.center !== viewboxCenter) {
      /// 校准滚动坐标
      this._inScrollInto = true;
      // 这里不时用 closestSlider.ele.scrollIntoView，因为如果ele在滚动，那么可能久失效
      this.hostEle.scrollTo({ left: closestSlider.center - viewboxWidth / 2, behavior: "smooth" });
    } else {
      this.onScrollEnd();
    }
  }
  private _tickFrame = 0;
  private _handleScrollTick() {
    if (this._tickFrame > 0) {
      return;
    }
    const doTick = () => {
      if (this._inTouch === false) {
        this._scrollTick -= 1;
      }
      console.verbose("scroll tick", this._scrollTick);
      if (this._scrollTick <= 0) {
        this._handleScrollStop();
        this._tickFrame = 0;
      } else {
        this._tickFrame = requestAnimationFrame(doTick);
      }
    };
    doTick();
  }

  private _scrolling = { startTime: 0 };
  private _scrollTick = 0;
  onScroll = (event: Event) => {
    event.cancelBubble = true;
    this._scrolling = { startTime: event.timeStamp };
    this._updateSliderStates();

    /// 如果不是在最后的scrollinto的控制中，那么需要持续监测滚动状况
    if (this._inScrollInto === false) {
      this._scrollTick = 3; /* 2帧率之后归零,1是当前帧 */
      this._handleScrollTick();
    }
  };
  onScrollEnd = (event?: Event) => {
    if (event) {
      event.cancelBubble = true;
    }
    if (this._scrolling.startTime > 0) {
      console.info("scroll end");
      this._inScrollInto = false;
      this._scrolling.startTime = 0;
    }
    this._updateSliderStates();
  };
  /**
   * 是否在“主动控制”中，包括：用户的触摸控制滚动
   */
  private _inTouch = false;
  onTouchStart = () => {
    this._inTouch = true;
    this._inScrollInto = false;
    console.info("touch start");
  };
  onTouchStop = () => {
    this._inTouch = false;
    console.info("touch stop");
  };
  //#endregion

  render() {
    return (
      <Host
        onScroll={this.onScroll}
        onScrollEnd={this.onScrollEnd}
        onTouchStart={this.onTouchStart}
        onTouchCancel={this.onTouchStop}
        onTouchEnd={this.onTouchStop}
      >
        <slot name="slider"></slot>
      </Host>
    );
  }
}

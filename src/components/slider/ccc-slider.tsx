import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  Watch,
} from "@stencil/core";
import { at, Logger, querySelectorAll, throttle } from "../../utils/utils";

const SLIDER_STATE_DATASET_KEY = "data-ccc-slider";

export type $Slider = {
  index: number;
  ele: HTMLElement;
  offsetLeft: number;
  offsetWidth: number;
  offsetCenter: number;
};
/**当前的“原因”
 * 如果是 user ，说明是用户在控制，此时应该避免去对它进行任何覆盖操作，避免行为不跟手
 * 如果是 auto ，说明是机器在控制
 */
export type $Reason = "user" | "auto";
type $InternalReason = "touch" | "mousewheel" | "into" | "init";

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
          this._querySliders();
          // 进行布局计算，并更新状态
          this._updateSliderStates();
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
    this.update();
  }

  disconnectedCallback() {
    this._inDOM = false;
    this._unbindTabs();
    this._mutationOb.disconnect();
  }
  //#endregion

  /**
   * 是否可以跨越多个slider进行滚动
   */
  @Prop({ reflect: true }) cross?: boolean;

  private _sliderList: $Slider[] = [];

  private _querySliders() {
    const sliderEles = querySelectorAll<HTMLElement>(this.hostEle, `:scope > [slot="slider"]`);
    this._sliderList = sliderEles.map((ele, i) => {
      const slider: $Slider = {
        index: i,
        ele,
        offsetLeft: 0,
        offsetWidth: 0,
        offsetCenter: 0,
      };
      return slider;
    });
    console.info("set sliderEles", this._sliderList);
  }

  private _cachedLayoutInfo?: ReturnType<CccSlider["_calcLayoutInfo"]>;
  /**
   * 获取这一帧的布局信息
   * @returns
   */
  private _calcLayoutInfo() {
    const {
      offsetLeft: viewboxOffsetLeft,
      offsetWidth: viewboxOffsetWidth,
      scrollLeft: viewboxScrollLeft,
    } = this.hostEle;
    const viewboxOffsetCenter = viewboxOffsetLeft + viewboxScrollLeft + viewboxOffsetWidth / 2;

    let closestSlider = {
      index: -1,
      ele: undefined as HTMLElement | undefined,
      offsetLeft: 0,
      offsetWidth: 0,
      offsetCenter: 0,
    };
    /// 更新slider的布局信息；并寻找"中线"现在进入到哪一个视图中
    for (const sliderLayoutInfo of this._sliderList) {
      const { offsetLeft, offsetWidth } = sliderLayoutInfo.ele;
      const offsetRight = offsetLeft + offsetWidth;

      sliderLayoutInfo.offsetLeft = offsetLeft;
      sliderLayoutInfo.offsetWidth = offsetWidth;
      sliderLayoutInfo.offsetCenter = offsetLeft + offsetWidth / 2;

      if (offsetLeft <= viewboxOffsetCenter && viewboxOffsetCenter <= offsetRight) {
        closestSlider = sliderLayoutInfo;
      }
    }
    return {
      closestSlider,
      viewbox: {
        scrollLeft: viewboxScrollLeft,
        offsetLeft: viewboxOffsetLeft,
        offsetWidth: viewboxOffsetWidth,
        offsetCenter: viewboxOffsetCenter,
      },
      reason: this._reason,
      activedIndex: Number.isNaN(this._activedIndex)
        ? this.defaultActivedIndex ?? this.activedIndex ?? 0
        : this._activedIndex,
    };
  }
  calcLayoutInfo() {
    if (this._cachedLayoutInfo === undefined) {
      this._cachedLayoutInfo = this._calcLayoutInfo();
      requestAnimationFrame(() => {
        this._cachedLayoutInfo = undefined;
      });
    }
    return this._cachedLayoutInfo;
  }

  @Method()
  async getLayoutInfo() {
    return this.calcLayoutInfo();
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
    const slider = at(this._sliderList, activedIndex, true);
    console.info("setActivedIndex", activedIndex, slider);
    if (slider) {
      const { scrollLeft, offsetLeft } = this.hostEle;
      const left = slider.offsetLeft - offsetLeft;
      if (scrollLeft !== left) {
        this._scrollInto(slider.offsetLeft - offsetLeft, behavior);
      } else if (Number.isNaN(this._activedIndex)) {
        this._updateSliderStates();
      }
    }
  }
  private _scrollInto(left: number, behavior: ScrollBehavior) {
    this._reasons.add("into");
    /// 校准滚动坐标
    this._inScrollInto = true;
    // 这里不时用 closestSlider.ele.scrollIntoView，因为如果ele在滚动，那么可能久失效
    this.hostEle.scrollTo({ left, behavior });
    console.info("scroll Into", left, behavior);
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
    this._querySliders();
    // 进行布局计算
    this.calcLayoutInfo();
    /// 需要进行初始化
    if (Number.isNaN(this._activedIndex)) {
      this._reasons.add("init");
      this._setActivedIndex(this.defaultActivedIndex ?? this.activedIndex, "auto" /* 初始化的时候减少动画 */);
      requestAnimationFrame(() => {
        this._reasons.delete("init");
      });
    }
  }

  @Event() activedSilderChange!: EventEmitter<[sliderEle: HTMLElement, activedIndex: number]>;

  private _preSliderStates?: { list: $Slider[]; activedIndex: number };
  /**
   * 通知slider-ele的状态变更
   * 更新activedIndex的值变更
   * 触发activedSilderChange事件
   */
  @throttle()
  private _updateSliderStates(layoutInfo = this.calcLayoutInfo()) {
    console.info("updateSliderStates", "reasons:", this._reasons);
    const {
      closestSlider,
      viewbox: { offsetCenter: viewboxOffsetCenter },
    } = layoutInfo;
    const { _sliderList: sliderList } = this;
    let changed = false;
    if (
      this._preSliderStates === undefined ||
      this._preSliderStates.list !== sliderList ||
      this._preSliderStates.activedIndex !== closestSlider.index
    ) {
      changed = true;
      this._preSliderStates = {
        list: sliderList,
        activedIndex: closestSlider.index,
      };

      for (const slider of sliderList) {
        if (slider.index === closestSlider.index - 1) {
          slider.ele.setAttribute(SLIDER_STATE_DATASET_KEY, "prev");
        } else if (slider.index === closestSlider.index) {
          slider.ele.setAttribute(SLIDER_STATE_DATASET_KEY, "actived");
        } else if (slider.index === closestSlider.index + 1) {
          slider.ele.setAttribute(SLIDER_STATE_DATASET_KEY, "next");
        } else {
          slider.ele.removeAttribute(SLIDER_STATE_DATASET_KEY);
        }
      }
    }

    /// 计算出 activedIndex
    const progress = (viewboxOffsetCenter - closestSlider.offsetCenter) / closestSlider.offsetWidth;
    this._activedIndex = closestSlider.index + progress;

    /// 触发事件
    if (changed) {
      console.info("emit activedSilderChange", this._activedIndex, closestSlider);
      this.activedSilderChange.emit([closestSlider.ele!, this._activedIndex]);
    }
  }

  //#region 滚动控制

  private _inScrollInto = false;
  /**
   * 在滚动停下的时候，强制滚动确保进入到卡片中
   */
  private _handleScrollStop() {
    console.success("scroll stop");
    const { closestSlider, viewbox } = this.calcLayoutInfo();
    console.info("closestSlider:", closestSlider);
    if (closestSlider.offsetCenter !== viewbox.offsetCenter) {
      this._scrollInto(closestSlider.offsetCenter - viewbox.offsetWidth / 2, "smooth");
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
    if (event && event.target !== this.hostEle) {
      return;
    }
    // event.cancelBubble = true;
    this._scrolling = { startTime: event.timeStamp };
    this._updateSliderStates();

    /// 如果不是在最后的scrollinto的控制中，那么需要持续监测滚动状况
    if (this._inScrollInto === false) {
      this._scrollTick = 3; /* 2帧率之后归零,1是当前帧 */
      this._handleScrollTick();
    }
  };
  onScrollEnd = (event?: Event) => {
    if (event && event.target !== this.hostEle) {
      return;
    }
    // if (event) {
    //   event.cancelBubble = true;
    // }
    if (this._scrolling.startTime > 0) {
      console.info("scroll end");
      this._inScrollInto = false;
      this._scrolling.startTime = 0;
    }

    this._reasons.delete("mousewheel");
    this._reasons.delete("into");
    /// 尝试触发事件
    this._updateSliderStates();
  };
  private get _reason(): $Reason {
    return this._reasons.size === 1 && this._reasons.has("into") ? "auto" : "user"; //: "auto";
  }
  private _reasons = new Set<$InternalReason>();
  onMouseWheel = () => {
    this._reasons.add("mousewheel");
  };
  /**
   * 是否在“主动控制”中，包括：用户的触摸控制滚动
   */
  private _inTouch = false;
  onTouchStart = () => {
    this._reasons.add("touch");
    this._inTouch = true;
    this._inScrollInto = false;
    console.info("touch start");
  };
  onTouchStop = () => {
    this._reasons.delete("touch");
    this._inTouch = false;
    console.info("touch stop");
  };
  //#endregion

  render() {
    return (
      <Host
        onScroll={this.onScroll}
        onScrollEnd={this.onScrollEnd}
        onMouseWheel={this.onMouseWheel}
        onTouchStart={this.onTouchStart}
        onTouchCancel={this.onTouchStop}
        onTouchEnd={this.onTouchStop}
      >
        <slot name="slider"></slot>
      </Host>
    );
  }
}

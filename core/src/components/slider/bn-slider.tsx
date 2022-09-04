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
import { at, Logger, querySlotAssignedElements } from "../../utils/utils";
import { SlotChangeHelper } from "../util/slotChange.helper";
import { BindFollowerHelper } from "../util/twoWayBinding.helper";
import { $BnSlider, $BnSliderFollower } from "./bn-slider.const";

const SLIDER_STATE_DATASET_KEY = "data-bn-slider";
type $ScrollToBehavior = ScrollBehavior | "set";

export type $Slider = {
  index: number;
  ele: HTMLElement;
  /**计算时，缓存的一些数值
   * 只在一些特定情况下使用，比如在同一帧里，基于这些缓存结果做“后续的计算”
   * 如果时DOM操作，请使用“实时数据”！
   */
  offsetLeftCache: number;
  offsetWidthCache: number;
  offsetCenterCache: number;
};
export type $NullableSlider = Omit<$Slider, "ele"> & { ele?: $Slider["ele"] };
const NULLABLE_SLIDER: Readonly<$NullableSlider> = Object.freeze({
  index: -1,
  ele: undefined,
  offsetLeftCache: 0,
  offsetWidthCache: 0,
  offsetCenterCache: 0,
});

type $InternalReason = "touch" | "mousewheel" | "into" | "init";

/**
 * slider 有三个底层函数，理解这三个函数就能控制整个slider，三个依次是：
 * 1. _querySliders 更新slider元素
 * 1. calcLayoutInfo 基于slider元素，与scrollLeft的值：计算slider与box的布局、滚动进度。这是最关键的一个函数，就是渲染所需的函数
 * 1. _updateSliderStates 根据计算出来的布局，将之反应到DOM元素上，并按需进行DOM事件的触发
 *
 * 基于这三个函数，衍生出了其它两个工具函数
 * 1. _scrollToIndex 滚动到指定的slider
 * 1. _scrollToLeft 滚动到指定的scrollLeft
 * 这两个函数有点不同，指定的left上可能会重叠slider，所以它们的使用场景并不完全相同
 * 一般情况下，这两个工具函数可以独立运作，当有时候还是需要搭配底层函数才能达到所需的效果
 *
 * 组件的生命周期都是围绕这这五个核心函数展开工作的，主要有以下的生命周期
 * 1. componentDidLoad 组件初始化到DOM-Tree中的时候，需要根据defaultActivedIndex进行渲染
 * 1. resize change 布局变化的时候，需要重新计算布局
 * 1. childList change 子元素变化的时候，需要重新获取slider元素
 * 1. onscroll 用户触发滚动的时候，需要实时计算状态并触发相应的更新
 */
@Component({
  tag: "bn-slider",
  styleUrl: "bn-slider.scss",
  shadow: true,
})
export class BnSlider implements ComponentInterface, $BnSlider {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);
  /**
   * 与其它节点的联动
   */
  private _followerHelper = new BindFollowerHelper<$BnSliderFollower>(
    this.hostEle,
    "for-slider",
    ele => {
      ele.bindSliderElement?.(this.hostEle); // 绑定
    },
    ele => {
      ele.bindSliderElement?.(null); // 解绑
    },
  );

  private _resizeOb = new ResizeObserver(() => {
    this.console.log("resize start");
    /// 重新计算布局，判断是否有必要进行滚动
    if (this.calcLayoutInfo(undefined, true).scrollProgress !== this._scrollProgress) {
      this._scrollToIndex(this._activedIndex, "auto");
    }
    this.console.log("resize end");
  });

  private _sliderSlotChangeHelper = new SlotChangeHelper(this.hostEle, "slider").onChange(elements => {
    this.console.log("slot=slider assignedElement changed");
    this._querySliders([...elements]);

    /// 如果在初始化阶段，那么不负责状态更新，以确保 defaultActivedIndex 正常工作
    if (this._reasons.has("init")) {
      return;
    }
    // 进行布局计算，并更新状态
    this._updateSliderStates();
  });

  connectedCallback() {
    this._followerHelper.connectedCallback();
  }
  /**初始化渲染完毕的时候 */
  componentDidLoad() {
    this.console.log("componentDidLoad");
    this._resizeOb.observe(this.hostEle);

    this._reasons.add("init");
    // 加载节点
    this._sliderSlotChangeHelper.componentDidLoad();
    // 进行布局计算
    this.calcLayoutInfo();
    /// 需要进行初始化
    if (this.defaultActivedIndex) {
      this.console.log("componentDidLoad", "!! scroll into defaultIndex", this.defaultActivedIndex);
      this._scrollToIndex(this.defaultActivedIndex, "set" /* 初始化的时候减少动画 */);
      // 这里确保 this._activedIndex 等状态值立刻变动到对应的值上来，避免接下来可能会立刻触发其它的更新，读取了 this._activedIndex 的原来的默认值
      this._updateSliderStates();
    } else {
      this.console.log("componentDidLoad", "!! scroll into activedIndex", this._activedIndex);
      this._scrollToIndex(this.defaultActivedIndex ?? this._activedIndex, "set" /* 初始化的时候减少动画 */);
    }
    this._reasons.delete("init");
  }

  disconnectedCallback() {
    this._followerHelper.disconnectedCallback();
    this._resizeOb.unobserve(this.hostEle);
    this._sliderSlotChangeHelper.disconnectedCallback();
  }

  private _sliderList: $Slider[] = [];

  private _querySliders(sliderEles = querySlotAssignedElements(this.hostEle, "slider")) {
    /// 没有发生任何改变
    if (
      this._sliderList.length === sliderEles.length &&
      this._sliderList.every((slider, index) => sliderEles[index] === slider.ele)
    ) {
      return;
    }
    this._sliderList = sliderEles.map((ele, i) => {
      const slider: $Slider = {
        index: i,
        ele,
        offsetLeftCache: 0,
        offsetWidthCache: 0,
        offsetCenterCache: 0,
      };
      return slider;
    });
    this.console.info("set sliderEles", this._sliderList);
  }

  private _cachedLayoutInfo?: ReturnType<BnSlider["_calcLayoutInfo"]>;
  /**
   * 获取这一帧的布局信息
   * @returns
   */
  private _calcLayoutInfo(viewboxScrollLeft: number = this.hostEle.scrollLeft) {
    const { offsetLeft: viewboxOffsetLeft, offsetWidth: viewboxOffsetWidth } = this.hostEle;
    const viewboxOffsetCenter = viewboxOffsetLeft + viewboxScrollLeft + viewboxOffsetWidth / 2;

    const closestSliderList: $Slider[] = [];
    let closestSlider = NULLABLE_SLIDER;
    /// 更新slider的布局信息；并寻找"中线"现在进入到哪一个视图中
    for (const sliderLayoutInfo of this._sliderList) {
      const { offsetLeft, offsetWidth } = sliderLayoutInfo.ele;
      const offsetRight = offsetLeft + offsetWidth;

      sliderLayoutInfo.offsetLeftCache = offsetLeft;
      sliderLayoutInfo.offsetWidthCache = offsetWidth;
      sliderLayoutInfo.offsetCenterCache = offsetLeft + offsetWidth / 2;

      if (offsetLeft <= viewboxOffsetCenter && viewboxOffsetCenter <= offsetRight) {
        closestSliderList.push(sliderLayoutInfo);
      }
    }

    /// 如果选中了多个，那么基于 defaultActivedIndex 来进行选择，否则选择第一个去
    if (closestSliderList.length > 1) {
      closestSlider =
        closestSliderList.find(slider => slider.index === this.defaultActivedIndex) || closestSliderList[0];
    } else {
      closestSlider = closestSliderList[0] || NULLABLE_SLIDER;
    }

    /// 计算出 scrollProgress
    const progress =
      closestSlider.offsetWidthCache === 0
        ? 0
        : (viewboxOffsetCenter - closestSlider.offsetCenterCache) / closestSlider.offsetWidthCache;

    return {
      closestSlider,
      viewbox: {
        scrollLeft: viewboxScrollLeft,
        offsetLeft: viewboxOffsetLeft,
        offsetWidth: viewboxOffsetWidth,
        offsetCenter: viewboxOffsetCenter,
      },
      sliderList: this._sliderList,
      activedIndex: closestSlider.index,
      scrollProgress: closestSlider.index + progress,
    };
  }
  private _calc_frame_id?: number;
  calcLayoutInfo(viewboxScrollLeft?: number, force?: boolean) {
    if (
      force ||
      this._cachedLayoutInfo === undefined ||
      (viewboxScrollLeft !== undefined && viewboxScrollLeft !== this._cachedLayoutInfo.viewbox.scrollLeft)
    ) {
      this._cachedLayoutInfo = this._calcLayoutInfo(viewboxScrollLeft);
      if (this._calc_frame_id !== undefined) {
        cancelAnimationFrame(this._calc_frame_id);
      }
      this._calc_frame_id = requestAnimationFrame(() => {
        this._calc_frame_id = undefined;
        this._cachedLayoutInfo = undefined;
      });
    }
    return this._cachedLayoutInfo;
  }

  @Method()
  async getLayoutInfo() {
    return this.calcLayoutInfo();
  }

  @Prop({}) readonly defaultActivedIndex: number = -1;
  @Prop({}) readonly activedIndex?: number;
  private _activedIndex = 0;
  @Watch("activedIndex")
  watchActivedIndex(newVal: number) {
    if (Number.isSafeInteger(newVal) === false) {
      return;
    }

    /// 对数据进行格式化
    newVal = Math.floor(newVal % this._sliderList.length);
    if (newVal < 0) {
      newVal += this._sliderList.length;
    }
    /// 不会发生变化
    if (newVal === this.calcLayoutInfo().closestSlider.index) {
      return;
    }
    // 发生变化了，进行滑动
    this._scrollToIndex(newVal, "smooth");
  }
  private _scrollProgress = 0;

  @Method()
  async getScrollProgress() {
    return this._scrollProgress;
  }
  @Method()
  async getActivedIndex() {
    return this._activedIndex;
  }
  /**滚动到指定的第几个元素上 */
  private _scrollToIndex(activedIndex: number, behavior: $ScrollToBehavior) {
    const slider = at(this._sliderList, activedIndex, true);
    this.console.info("setActivedIndex", activedIndex, slider);

    /// 使用真实的scrollLeft，而不是缓存的，缓存是给
    const scrollLeft = slider ? slider.ele.offsetLeft - this.hostEle.offsetLeft : 0;

    /// 计算布局，将更新布局的计算结果
    const layoutInfo = this.calcLayoutInfo(scrollLeft, true);

    /**
     * 如果根据scrollLeft计算出来的 closestSlider 与 scrollLeft 对不上，那么就需要用一些特殊的手段来干预接下来的 updateState
     * > 比如说不可见的情况下，大家的 width 与 left 都是 0，这时候 二者就有可能对不上
     */
    if (slider && layoutInfo.closestSlider.index !== slider.index) {
      layoutInfo.closestSlider = slider;
      layoutInfo.scrollProgress = slider.index;
      behavior = "set";
    }

    // 执行滚动
    this.console.info("scroll to index:", activedIndex, behavior);
    this._setScrollLeft(scrollLeft, behavior);
  }
  /**滚动到指定的坐标位置上 */
  private _scrollToLeft(left: number, behavior: ScrollBehavior) {
    // 执行滚动
    this.console.info("scroll to left:", left, behavior);
    this._setScrollLeft(left, behavior);
  }

  /**
   * scrollTo 是瞬发的函数，它不会触发 onscroll 与 onscrollend。behavior:smooth 只是一个硬件加速的滚动
   * 所以在执行完该函数后，需要立即进行相关的布局计算与事件触发
   * @param left
   * @param behavior
   */
  private _setScrollLeft(left: number, behavior: $ScrollToBehavior) {
    this._reasons.add("into");
    this._inScrollInto = true;
    /// 如果不需要滚动，那么只需要手动触发一下滚动的函数回调函数就行
    if (left === this.hostEle.scrollLeft) {
      // 这里不需要raf，因为 scroll 回调函数的触发本来就是瞬发的
      this.onScrollEnd();
    } else {
      if (behavior === "set") {
        this.hostEle.scrollLeft = left;
      } else {
        // 这里不时用 closestSlider.ele.scrollIntoView，因为如果ele在滚动，那么可能久失效
        this.hostEle.scrollTo({ left, behavior });
      }
    }
  }

  /**滚动到特定的 activedIndex */
  @Method()
  async slideTo(activedIndex: number, behavior: ScrollBehavior = "smooth") {
    this._reasons.add("into");
    this._scrollToIndex(activedIndex, behavior);
  }
  /**强制刷新渲染 */
  @Method()
  async update() {
    this._querySliders();
    // 进行布局计算，并更新状态
    this._updateSliderStates();
  }

  /**
   * 在初始化的时候，只要有元素，那么它总会触发
   */
  @Event() activedSliderChange!: EventEmitter<[sliderEle: HTMLElement | undefined, index: number]>;
  @Event() activedIndexChange!: EventEmitter<$BnSlider.ActivedIndexChangeDetail>;
  private _emitActivedChange(sliderEle: HTMLElement | undefined, index: number) {
    this.activedSliderChange.emit([sliderEle, index]);
    this.activedIndexChange.emit(index);
  }

  private _preSliderStates: { list: $Slider[]; activedIndex: number } = {
    list: [],
    activedIndex: this.defaultActivedIndex,
  };
  /**
   * 通知slider-ele的状态变更
   * 更新activedIndex的值变更
   * 触发activedSliderChange事件
   */
  // @throttle()
  private _updateSliderStates(layoutInfo = this.calcLayoutInfo()) {
    this.console.lazyInfo(() => ["updateSliderStates", "reasons:", this._reasons, this._reason, { ...layoutInfo }]);
    const { closestSlider } = layoutInfo;
    const { _sliderList: sliderList, _preSliderStates: preSliderStates } = this;
    let changed = false;
    if (preSliderStates.list !== sliderList || preSliderStates.activedIndex !== closestSlider.index) {
      const newSliderStates = {
        list: sliderList,
        activedIndex: closestSlider.index,
      };
      changed =
        at(preSliderStates.list, preSliderStates.activedIndex) !==
        at(newSliderStates.list, newSliderStates.activedIndex);
      this._preSliderStates = newSliderStates;

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

    /// 绑定计算出的 activedIndex 与 scrollProgress
    this._scrollProgress = layoutInfo.scrollProgress;
    this._activedIndex = layoutInfo.activedIndex;

    /// 触发事件
    if (changed) {
      this.console.info("emit activedSliderChange", this._scrollProgress, closestSlider);
      this._emitActivedChange(closestSlider.ele, closestSlider.index);
    }
  }

  //#region 滚动控制

  private _inScrollInto = false;
  /**
   * 在滚动停下的时候，强制滚动确保进入到卡片中
   */
  private _handleScrollStop() {
    this.console.success("scroll stop");
    const { closestSlider, viewbox } = this.calcLayoutInfo();
    this.console.info("closestSlider:", closestSlider);
    if (closestSlider.offsetCenterCache !== viewbox.offsetCenter) {
      this._scrollToLeft(closestSlider.offsetCenterCache - viewbox.offsetWidth / 2, "smooth");
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
      this.console.verbose("scroll tick", this._scrollTick);
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

    if (this._scrolling.startTime > 0) {
      this.console.info("scroll end");
      this._scrolling.startTime = 0;
    }
    this._inScrollInto = false;

    /// 尝试触发事件
    this._updateSliderStates();

    this._reasons.delete("mousewheel");
    this._reasons.delete("into");
  };
  private get _reason(): $BnSlider.Reason {
    if (this._reasons.size === 0 || this._reasons.has("mousewheel") || this._reasons.has("touch")) {
      return "user";
    }
    return "auto";
  }
  private _reasons = new Set<$InternalReason>();
  @Method()
  async getReason() {
    return this._reason;
  }
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
    this.console.info("touch start");
  };
  onTouchStop = () => {
    this._reasons.delete("touch");
    this._inTouch = false;
    this.console.info("touch stop");
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

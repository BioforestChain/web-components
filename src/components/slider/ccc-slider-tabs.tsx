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
import { at, Logger, querySelector, querySelectorAll } from "../../utils/utils";
import { $CccLayout, $CccLayoutFollower, $CccSlider, $CccSliderFollower, isCccSlider } from "./ccc-slider.const";

export type $Tab = {
  index: number;
  ele: HTMLElement;
  offsetWidthCache: number;
  offsetLeftCache: number;
  size: number;
};
export type $NullableTab = Omit<$Tab, "ele"> & { ele?: $Tab["ele"] };
// const DEFAULT_CURSOR_LAYOUT: $Tab = { width: 0, left: 0 };

const TAB_STATE_DATASET_KEY = "data-ccc-slider-tabs";

export interface $CccSliderTabsFollower {
  bindLayoutFollowerElement(ele?: HTMLElement | null): void;
}
/**
 * slider-tabs有两个核心部件组成：
 * 1. 一个是滚动动画
 * 1. 一个是触发器
 *
 * 其中触发器有两种模式：
 * 1. 一种是找不到 for=slider 元素的情况下，它会有自己的触发器，就是基于 click 事件来进行触发
 * 1. 一种是能找到 for=slider 元素的情况下，它的所有“滚动动画”都是跟随着 slider 的滚动事件来进行执行的。
 *    > 在这种模式下，click 事件会转化成对 slider 的控制，然后基于 slider 的变化再回来影响 tabs 的动画
 */
@Component({
  tag: "ccc-slider-tabs",
  styleUrl: "ccc-slider-tabs.scss",
  shadow: true,
})
export class CccSliderTabs implements ComponentInterface, $CccSliderFollower, $CccLayout, $CccSlider {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);
  //#region 与其它节点的联动
  get id() {
    return this.hostEle.id;
  }

  private _bindingEles: $CccLayoutFollower[] = [];
  private _bindingFollowers() {
    if (this.id) {
      for (const tabsEle of (this._bindingEles = querySelectorAll<$CccLayoutFollower>(
        document,
        `[for-layout=${this.id}]`,
      ))) {
        tabsEle.bindLayoutElement?.(this.hostEle); // 绑定
      }
    }
  }
  private _unbindFollowers() {
    for (const tabsEle of this._bindingEles) {
      tabsEle.bindLayoutElement?.(null); // 解绑
    }
    this._bindingEles.length = 0;
  }

  connectedCallback() {
    this._bindingFollowers();
  }

  //#endregion

  //#region 与 slider 元素通过 for 属性进行联动绑定
  /**
   * the `<ccc-slider>` element id
   */
  @Prop({}) forSlider?: string;
  @Watch("forSlider")
  watchForSlider() {
    return this._bindSliderElement(
      this.forSlider ? querySelector<$CccSlider.HTMLCccSliderElement>(document, `#${this.forSlider}`) : null,
    );
  }
  private _sliderEle: $CccSlider.HTMLCccSliderElement | null = null;

  @Prop({}) forTabs?: string;

  /**
   * 手动绑定或者解绑 for 元素
   * 从而让 `<ccc-slider>` 元素能主动 根据自己的生命周期来与 tabs 进行绑定联动
   * @param _sliderEle
   * @returns
   */
  @Method()
  async bindSliderElement(_sliderEle?: HTMLElement | null) {
    await this._bindSliderElement(_sliderEle);
  }
  private async _bindSliderElement(_sliderEle?: HTMLElement | null) {
    const sliderEle = isCccSlider(_sliderEle) ? _sliderEle : null;
    if (sliderEle !== _sliderEle) {
      this.console.error("for attribute can only binding <ccc-slider> element");
    }
    if (sliderEle === this._sliderEle) {
      return;
    }
    /// 解绑
    if (this._sliderEle) {
      this._sliderEle.removeEventListener("activedIndexChange", this._onForEleActivedIndexChange);
    }

    /// 绑定
    if (sliderEle) {
      this._sliderEle = sliderEle;
      sliderEle.addEventListener("activedIndexChange", this._onForEleActivedIndexChange);
      // 立刻进行渲染绑定
      this._updateTabLayoutInfo(this._calcLayoutInfo(await sliderEle.getActivedIndex()));
    }
    return sliderEle;
  }

  private _onForEleActivedIndexChange = (event: CustomEvent<$CccSlider.ActivedIndexChangeDetail>) => {
    const ele = event.target;
    if (ele !== this._sliderEle) {
      return;
    }
    this._updateTabLayoutInfo(this._calcLayoutInfo(event.detail));
  };

  //#endregion

  @Prop({}) defaultActivedIndex?: number;
  @Prop({}) readonly activedIndex!: number;
  private _activedIndex = 0;
  @Watch("activedIndex")
  watchActivedIndex(newVal: number) {
    if (Number.isSafeInteger(newVal) === false) {
      return;
    }

    /// 对数据进行格式化
    newVal = Math.floor(newVal % this._tabList.length);
    if (newVal < 0) {
      newVal += this._tabList.length;
    }

    this._setActivedIndex(newVal);
  }

  private _setActivedIndex(activedIndex: number, _behavior: ScrollBehavior = "smooth") {
    /// 如果有 for 绑定，那么跟随for绑定
    if (this._sliderEle) {
      this._sliderEle.slideTo(activedIndex);
    }
    /// 没有for绑定，自己进行渲染
    else {
      // 选中新的tab对象
      this._updateTabLayoutInfo(this._calcLayoutInfo(activedIndex));
    }
  }

  /**
   * 提供基础的布局信息，虽然自己不用，但是方便外部开发相关的组件
   */
  @Event() layoutChange!: EventEmitter<$CccLayout.LayoutChangeDetail>;
  private _emitLayoutChange() {
    this.layoutChange.emit(this.calcLayoutInfo());
  }
  @Method()
  async getLayoutInfo() {
    return this.calcLayoutInfo();
  }

  private _tabList: Array<$Tab> = [];
  private _queryTabs() {
    const tabEles = querySelectorAll<HTMLElement>(this.hostEle, ':scope > [slot="tab"]');
    this._tabList = tabEles.map((ele, i) => {
      const slider: $Tab = {
        index: i,
        ele,
        offsetLeftCache: 0,
        offsetWidthCache: 0,
        size: 0,
      };
      return slider;
    });
  }

  private _resizeOb = new ResizeObserver(() => {
    this.console.log("resize");
    this.calcLayoutInfo(undefined, true);
  });
  private _mutationOb = new MutationObserver(entries => {
    for (const entry of entries) {
      if (entry.type === "attributes") {
        this.console.log("MutationObserver attributes changed");
        this._unbindFollowers();
        this._bindingFollowers();
      } else if (entry.type === "childList") {
        this.console.log("MutationObserver childList changed");
        this._queryTabs();
        this.calcLayoutInfo(undefined, true);
        this._updateTabLayoutInfo();
        this._emitLayoutChange();
      }
    }
  });

  private _tabListEle?: HTMLElement;
  async componentDidLoad() {
    this.console.log("componentDidLoad");
    this._mutationOb.observe(this.hostEle, { childList: true });
    this._tabListEle = querySelector(this.hostEle.shadowRoot, ".tab-list");
    this._resizeOb.observe(this._tabListEle!);

    this._queryTabs();
    this.calcLayoutInfo(undefined, true);

    if (!(await this.watchForSlider())) {
      this._updateTabLayoutInfo();
      this._emitLayoutChange();
    }
  }
  disconnectedCallback() {
    if (this._tabListEle) {
      this._resizeOb.unobserve(this._tabListEle);
    }
    this._mutationOb.disconnect();
    this._unbindFollowers();
  }

  onClick = (event: MouseEvent) => {
    const ele = event.target ? (event.target instanceof HTMLElement ? event.target : null) : null;
    if (!ele) {
      return;
    }
    let tabEle = ele.closest<HTMLElement>(`[slot="tab"]`);
    /// 无法在结构上找到，那么只能根据X坐标来寻找
    if (tabEle === null) {
      for (const { ele } of this._tabList) {
        if (ele.offsetLeft <= event.clientX && event.clientX <= ele.offsetLeft + ele.offsetWidth) {
          tabEle = ele;
          break;
        }
      }
    }
    this.console.info("clicked", tabEle);

    this._setActivedIndex(this._tabList.findIndex(tab => tab.ele === tabEle));
  };

  private _preTabStates: { list: $Tab[]; activedTab?: $Tab } = { list: [], activedTab: undefined };
  private _updateTabLayoutInfo(layoutInfo = this.calcLayoutInfo()) {
    let changed = false;
    const { _preTabStates: preTabStates } = this;
    if (preTabStates.list !== layoutInfo.blockList || preTabStates.activedTab !== layoutInfo.activedTab) {
      changed = true;
      this._preTabStates = {
        list: layoutInfo.blockList,
        activedTab: layoutInfo.activedTab,
      };

      for (const tab of this._tabList) {
        if (tab.index === layoutInfo.activedIndex - 1) {
          tab.ele.setAttribute(TAB_STATE_DATASET_KEY, "prev");
        } else if (tab.index === layoutInfo.activedIndex) {
          tab.ele.setAttribute(TAB_STATE_DATASET_KEY, "actived");
        } else if (tab.index === layoutInfo.activedIndex + 1) {
          tab.ele.setAttribute(TAB_STATE_DATASET_KEY, "next");
        } else {
          tab.ele.removeAttribute(TAB_STATE_DATASET_KEY);
        }
      }
    }

    this._activedIndex = layoutInfo.activedIndex;

    /// 触发事件更新
    if (changed) {
      this._emitActivedChange(layoutInfo.activedTab?.ele, layoutInfo.activedIndex);
      this.console.log("activedTabChange", layoutInfo.activedTab);
    }
  }

  private _cachedLayoutInfo?: ReturnType<CccSliderTabs["_calcLayoutInfo"]>;
  private _calcLayoutInfo(activedIndex = this._activedIndex) {
    this.console.log("calcLayoutInfo", activedIndex);

    const {
      offsetLeft: viewboxOffsetLeft,
      offsetWidth: viewboxOffsetWidth,
      scrollLeft: viewboxScrollLeft,
    } = this.hostEle;

    for (const tabLayoutInfo of this._tabList) {
      const { offsetLeft, offsetWidth } = tabLayoutInfo.ele;

      tabLayoutInfo.offsetLeftCache = offsetLeft;
      tabLayoutInfo.offsetWidthCache = offsetWidth;
      tabLayoutInfo.size = offsetWidth;
    }
    const activedTab = at(this._tabList, activedIndex);

    return {
      box: {
        viewOffsetLeft: viewboxOffsetLeft,
        viewOffsetWidth: viewboxOffsetWidth,
        viewSize: viewboxOffsetWidth,
        scrollSize: viewboxScrollLeft,
      },
      blockList: this._tabList,
      activedIndex: activedTab?.index ?? -1,
      activedTab: activedTab,
    };
  }
  private _calc_frame_id?: number;
  calcLayoutInfo(activedIndex?: number, force?: boolean) {
    if (
      force ||
      this._cachedLayoutInfo === undefined ||
      (activedIndex !== undefined && this._cachedLayoutInfo?.activedIndex !== activedIndex)
    ) {
      this._cachedLayoutInfo = this._calcLayoutInfo(activedIndex);
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

  //#region 一些必要的接口

  @Event() activedTabChange!: EventEmitter<[tabEle: HTMLElement | undefined, index: number]>;
  @Event() activedIndexChange!: EventEmitter<number>;
  private _emitActivedChange(tabEle: HTMLElement | undefined, index: number) {
    this.activedTabChange.emit([tabEle, index]);
    this.activedIndexChange.emit(index);
  }

  @Method()
  async slideTo(activedIndex: number) {
    this._setActivedIndex(activedIndex);
  }
  @Method()
  async getScrollProgress() {
    return this._activedIndex;
  }
  @Method()
  async getActivedIndex(): Promise<number> {
    return this._activedIndex;
  }
  //#endregion

  render() {
    return (
      <Host onClick={this.onClick}>
        <div class="tab-list" part="tabs">
          <slot name="tab"></slot>
        </div>
        <slot></slot>
      </Host>
    );
  }
}

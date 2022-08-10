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
import { at, Logger, querySelector, querySlotAssignedElements } from "../../utils/utils";
import { BindFollowerHelper } from "../util/twoWayBinding.helper";
import {
  $CccLayout,
  $CccLayoutFollower,
  $CccSlider,
  $CccSliderFollower,
  isCccLayoutEqual,
  isCccSlider,
} from "./ccc-slider.const";

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
 * slider-tabs有两个底层函数：
 * 1. _queryTabs 查询[slot=tab]的元素
 * 1. calcLayoutInfo 计算布局情况，该函数没有实际作用，只是为了满足 $CccLayout 的实现
 * 1. _updateTabLayoutInfo 将计算布局情况更新到DOM中，并触发相关的DOM事件
 */
@Component({
  tag: "ccc-slider-tabs",
  styleUrl: "ccc-slider-tabs.scss",
  shadow: true,
})
export class CccSliderTabs implements ComponentInterface, $CccSliderFollower, $CccLayout, $CccSlider {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);
  /**
   * 与其它节点的联动
   */
  private _layoutFollower = new BindFollowerHelper<$CccLayoutFollower>(
    this.hostEle,
    "for-layout",
    ele => {
      ele.bindLayoutElement?.(this.hostEle); // 绑定
    },
    ele => {
      ele.bindLayoutElement?.(null); // 解绑
    },
  );
  private _sliderFollower = new BindFollowerHelper<$CccSliderFollower>(
    this.hostEle,
    "for-slider",
    ele => {
      ele.bindSliderElement?.(this.hostEle); // 绑定
    },
    ele => {
      ele.bindSliderElement?.(null); // 解绑
    },
  );

  //#region 与 slider 元素通过 for 属性进行联动绑定
  /**
   * the `<ccc-slider>` element id
   */
  @Prop({}) forSlider?: string;
  @Watch("forSlider")
  watchForSlider(forSlider: string | undefined) {
    return this._bindSliderElement(
      forSlider ? querySelector<$CccSlider.HTMLCccSliderElement>(document, `#${this.forSlider}`) : null,
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
    if (sliderEle !== _sliderEle && _sliderEle != undefined) {
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
      this._updateTabLayoutInfo(this.calcLayoutInfo(await sliderEle.getActivedIndex()));
    }
    return sliderEle;
  }

  private _onForEleActivedIndexChange = (event: CustomEvent<$CccSlider.ActivedIndexChangeDetail>) => {
    const ele = event.target;
    if (ele !== this._sliderEle) {
      return;
    }
    this._updateTabLayoutInfo(this.calcLayoutInfo(event.detail));
  };

  //#endregion

  @Prop({}) defaultActivedIndex?: number;
  @Prop({}) readonly activedIndex?: number;
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
      this._updateTabLayoutInfo(this.calcLayoutInfo(activedIndex));
    }
  }

  /**
   * 提供基础的布局信息，虽然自己不用，但是方便外部开发相关的组件
   */
  @Event() layoutChange!: EventEmitter<$CccLayout.LayoutChangeDetail>;

  private _preLayoutInfo?: $CccLayout.LayoutChangeDetail;
  private _tryEmitLayoutChange(layoutInfo: $CccLayout.LayoutChangeDetail) {
    if (this._preLayoutInfo && isCccLayoutEqual(this._preLayoutInfo, layoutInfo)) {
      return;
    }
    this._preLayoutInfo = layoutInfo;

    this.layoutChange.emit(layoutInfo);
  }
  @Method()
  async getLayoutInfo() {
    return this.calcLayoutInfo();
  }

  private _tabList: Array<$Tab> = [];
  private _queryTabs() {
    const tabEles = querySlotAssignedElements(this.hostEle, "tab");
    if (this._tabList.length === tabEles.length && this._tabList.every((tab, index) => tabEles[index] === tab.ele)) {
      return;
    }
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
    // 这里只是触发resize相关的计算，不用 updateTabLayoutInfo
    this.calcLayoutInfo(undefined, true);
  });
  private _mutationOb = new MutationObserver(entries => {
    for (const entry of entries) {
      if (entry.type === "childList") {
        this.console.log("MutationObserver childList changed");
        this._queryTabs();
        this._updateTabLayoutInfo(this.calcLayoutInfo(undefined, true));
      }
    }
  });

  private _tabListEle?: HTMLElement;

  connectedCallback() {
    this._layoutFollower.connectedCallback();
    this._sliderFollower.connectedCallback();
  }
  async componentDidLoad() {
    this.console.log("componentDidLoad");
    this._mutationOb.observe(this.hostEle, { childList: true });
    this._tabListEle = querySelector(this.hostEle.shadowRoot, ".tab-list");
    this._resizeOb.observe(this._tabListEle!);

    // 初始化tabs
    this._queryTabs();

    /// 如果没有找到需要跟随的slider，那么就将自己当成slider来使用
    if (!(await this.watchForSlider(this.forSlider))) {
      this._updateTabLayoutInfo(this.calcLayoutInfo(this.defaultActivedIndex));
    }
  }
  disconnectedCallback() {
    if (this._tabListEle) {
      this._resizeOb.unobserve(this._tabListEle);
    }
    this._mutationOb.disconnect();
    this._layoutFollower.disconnectedCallback();
    this._sliderFollower.disconnectedCallback();
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
    this.console.log("calcLayoutInfo  activedIndex:", activedIndex);

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
      const layoutInfo = this._calcLayoutInfo(activedIndex);
      this._tryEmitLayoutChange(layoutInfo);
      this._cachedLayoutInfo = layoutInfo;
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
  @Method()
  async getReason() {
    if (this._sliderEle) {
      return "auto";
    } else {
      return "user";
    }
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

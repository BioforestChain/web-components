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
import { at, cssAnimationDurationToMs, Logger, throttle, querySelector, querySelectorAll } from "../../utils/utils";

type CursorLayout = {
  width: number;
  left: number;
};
const DEFAULT_CURSOR_LAYOUT: CursorLayout = { width: 0, left: 0 };

const TAB_STATE_DATASET_KEY = "data-ccc-slider-tabs";

@Component({
  tag: "ccc-slider-tabs",
  styleUrl: "ccc-slider-tabs.scss",
  shadow: true,
})
export class CccSliderTabs implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(() => this.hostEle);
  /**
   * the <ccc-silder> element id
   */
  @Prop({ reflect: true, mutable: true }) for?: string;
  private _canWriteAttr_for = true;
  @Watch("for")
  watchFor() {
    this._canWriteAttr_for = false;
    this.bindForElement(this.for ? querySelector<HTMLCccSliderElement>(document, `#${this.for}`) : null);
    this._canWriteAttr_for = true;
  }
  private _syncToForActivedIndex(activedIndex: number) {
    if (this._forEle) {
      this.console.log("set forEle activedIndex as", activedIndex);
      this._forEle.slideTo(activedIndex);
    }
  }

  // /**
  //  * 是否跟随着for元素
  //  * 如果true，那么它的activedIndex不会反应给for元素
  //  * 在for元素要对其进行控制的时候，它会被控制成true
  //  */
  // @Prop({ reflect: true, mutable: true }) followFor?: boolean;

  @Prop({ reflect: true }) defaultActivedIndex?: number;
  @Prop({ reflect: true }) activedIndex?: number;
  @Watch("activedIndex")
  watchActivedIndex(newVal: number | undefined) {
    this._setActivedIndex(newVal);
  }

  private _activedIndex = NaN;
  @Method()
  async getActivedIndex() {
    return this._activedIndex;
  }
  private _setActivedIndex(activedIndex?: number, _behavior: ScrollBehavior = "smooth", userGesture = false) {
    if (activedIndex === undefined || Number.isSafeInteger(activedIndex) === false) {
      return;
    }
    /// 如果有 for 绑定，那么跟随for绑定
    if (this._forEle) {
      const selectedIndex = this._tabElements.indexOf(at(this._tabElements, activedIndex, true)!);
      if (selectedIndex !== -1) {
        /// 如果用户正在手势操作中，那么下一帧再生效，避免冲突
        if (userGesture) {
          requestAnimationFrame(() => {
            this._syncToForActivedIndex(selectedIndex);
          });
        } else {
          this._syncToForActivedIndex(selectedIndex);
        }
      }
    }
    /// 没有for绑定，自己进行渲染
    if (Number.isNaN(this._activedIndex) || this._forEle === null) {
      // 尝试选中新的tab对象
      this._selectTab(at(this._tabElements, activedIndex, true));

      // 更新插槽的css属性来做出动画，这里不和 selectTab 一起。因为 activedIndex 可能是小数
      this._effectCursorLayout(activedIndex);
    }
  }

  @Event() activedTabChange!: EventEmitter<[HTMLElement | null, number]>;

  private _forEle: HTMLCccSliderElement | null = null;
  private _onForEleActivedSliderChange = (event: CustomEvent<[sliderEle: HTMLElement, activedIndex: number]>) => {
    this._onForEleScroll(event);
    // if (event.target !== this._forEle) {
    //   return;
    // }
    // const [_, activedIndex, isInControll] = event.detail;
    // if (isInControll) {
    //   this.logger.success("ActivedSliderChange", activedIndex);
    //   this.selectTab(at(this._tabElements, Math.round(activedIndex), true));
    //   // 更新插槽的css属性来做出动画
    //   this._effectCursorLayout(activedIndex);
    // } else {
    //   this.logger.info("ActivedSliderChange", activedIndex);
    // }
  };

  private _onForEleScroll = async (event: Event) => {
    const ele = event.target as HTMLCccSliderElement;
    if (ele !== this._forEle) {
      return;
    }
    const layoutInfo = await ele.getLayoutInfo();
    if (layoutInfo.reason === "user") {
      this.console.verbose("USER scroll", layoutInfo.activedIndex);
    } else {
      this.console.verbose("AUTO scroll", layoutInfo.activedIndex);
    }

    this._selectTab(at(this._tabElements, Math.round(layoutInfo.activedIndex), true));
    // 更新插槽的css属性来做出动画
    this._effectCursorLayout(layoutInfo.activedIndex);
  };

  private _tabElements: Array<HTMLElement> = [];
  public get tabElements() {
    return this._tabElements;
  }
  public set tabElements(value) {
    this._tabElements = value;
  }
  private _cursorLayouts: Array<CursorLayout> = [];
  /**
   * 计算底部浮标的布局位置
   */
  @throttle()
  private async _calcCursorSlotLayouts() {
    if (this._tabListEle === undefined) {
      return;
    }
    this.console.log("_calcCursorSlotLayouts");
    const offsetLeftStart = this._tabListEle.offsetLeft;
    const cursorLayouts = this._cursorLayouts;
    cursorLayouts.length = 0;

    for (const tabEle of (this.tabElements = querySelectorAll<HTMLElement>(this.hostEle, ':scope > [slot="tab"]'))) {
      const left = tabEle.offsetLeft - offsetLeftStart;
      const width = tabEle.offsetWidth;
      cursorLayouts.push({ left, width });
    }
    this._cursorLayouts = cursorLayouts;
    // 布局变更，重新绘制
    if (Number.isNaN(this._activedIndex)) {
      this._setActivedIndex(this.defaultActivedIndex ?? this.activedIndex ?? 0);
    } else {
      this._effectCursorLayout(this._activedIndex);
    }
  }
  private _resizeOb = new ResizeObserver(() => {
    this.console.log("resize");
    this._calcCursorSlotLayouts();
  });
  private _mutationOb = new MutationObserver(() => {
    this.console.log("mutation");
    this._calcCursorSlotLayouts();
  });
  connectedCallback() {
    this.watchFor();
    this.console.log("connectedCallback");
  }
  private _tabListEle?: HTMLElement;
  private _cursorEle?: HTMLElement;
  componentDidLoad() {
    this.console.log("componentDidLoad");
    this._mutationOb.observe(this.hostEle, { childList: true });
    this._cursorEle = querySelector(this.hostEle.shadowRoot, ".cursor");
    this._resizeOb.observe((this._tabListEle = querySelector(this.hostEle.shadowRoot, ".tab-list")!));
  }
  disconnectedCallback() {
    if (this._tabListEle) {
      this._resizeOb.unobserve(this._tabListEle);
    }
    this._mutationOb.disconnect();
  }

  /**
   * 手动绑定或者解绑for元素
   * 从而栏 <ccc-slider> 元素能主动 根据自己的生命周期来与 tabs 进行绑定联动
   * @param _forEle
   * @returns
   */
  @Method()
  async bindForElement(_forEle?: HTMLElement | null) {
    const forEle = _forEle
      ? _forEle instanceof HTMLElement && _forEle.tagName === "CCC-SLIDER"
        ? (_forEle as HTMLCccSliderElement)
        : null
      : null;
    if (forEle !== _forEle) {
      this.console.error("for attribute can only binding <ccc-slider> element");
    }
    if (forEle === this._forEle) {
      return;
    }
    /// 解绑
    if (this._forEle) {
      (this._forEle as any).removeEventListener("activedSilderChange", this._onForEleActivedSliderChange);
      (this._forEle as any).removeEventListener("scroll", this._onForEleScroll);
      (this._forEle as any).removeEventListener("scrollend", this._onForEleScroll);
    }

    /// 绑定
    if (forEle) {
      this._forEle = forEle;
      (forEle as any).addEventListener("activedSilderChange", this._onForEleActivedSliderChange);
      (this._forEle as any).addEventListener("scroll", this._onForEleScroll);
      (this._forEle as any).addEventListener("scrollend", this._onForEleScroll);
    }

    if (this._canWriteAttr_for) {
      this.for = forEle?.id ?? undefined;
    }
  }

  static _childrenObs = new MutationObserver(mutationRecords => {
    for (const record of mutationRecords) {
      record.addedNodes;
    }
  });

  private _activiedTabEle: HTMLElement | null = null;
  onClick = (event: MouseEvent) => {
    const ele = event.target ? (event.target instanceof HTMLElement ? event.target : null) : null;
    if (!ele) {
      return;
    }
    this.console.info("clicked");
    let tabEle = ele.closest<HTMLElement>(`[slot="tab"]`);
    /// 无法在结构上找到，那么只能根据X坐标来寻找
    if (tabEle === null) {
      for (const ele of this.tabElements) {
        if (ele.offsetLeft <= event.clientX && event.clientX <= ele.offsetLeft + ele.offsetWidth) {
          tabEle = ele;
          break;
        }
      }
    }
    /// 如果还是找不到，那么点击的区域有问题，直接跳过
    if (tabEle === null || tabEle.getAttribute(TAB_STATE_DATASET_KEY) === "disabled") {
      return;
    }

    this._setActivedIndex(this._tabElements.indexOf(tabEle), undefined, true);
  };
  private _selectTab(_newTabEle: HTMLElement | null | undefined = at(this._tabElements, this._activedIndex, true)) {
    const newTabEle = _newTabEle instanceof HTMLElement ? _newTabEle : null;
    const oldTabEle = this._activiedTabEle;
    if (newTabEle === oldTabEle) {
      return;
    }
    oldTabEle?.removeAttribute(TAB_STATE_DATASET_KEY);
    newTabEle?.setAttribute(TAB_STATE_DATASET_KEY, "actived");
    const activedIndex = newTabEle ? this._tabElements.indexOf(newTabEle) : -1;

    /// 更新属性
    this._activiedTabEle = newTabEle; // 务必要先写入这个值，因为后面activedIndex的写入会引发selectTab被在此调用
    this._activedIndex = activedIndex;

    /// 触发事件更新
    this.activedTabChange.emit([newTabEle, activedIndex]);
    this.console.log("activedTabChange", newTabEle, activedIndex);
    return activedIndex;
  }

  /**引用游标的插槽布局 */
  @throttle()
  private async _effectCursorLayout(activedIndex = this._activedIndex) {
    this.console.log("_effectCursorLayout");

    const cursorEle = this._cursorEle;
    if (!cursorEle) {
      return;
    }

    const cursorEleStyle = cursorEle.style;
    /// 获取新的布局目标
    let nextCursorLayout = DEFAULT_CURSOR_LAYOUT;
    let useAnimation = true;

    const progress = activedIndex % 1;
    const cursorLayout = at(this._cursorLayouts, activedIndex, true);
    if (cursorLayout) {
      nextCursorLayout = cursorLayout;
    }
    /// 如果有特殊的进度，那么不使用动画，直接依赖于属性过去
    if (progress > 0 /* NaN>0 === false */) {
      useAnimation = false;
      const cursorLayout = at(this._cursorLayouts, activedIndex + 1, true);
      if (cursorLayout) {
        nextCursorLayout = {
          left: (cursorLayout.left - nextCursorLayout.left) * progress + nextCursorLayout.left,
          width: (cursorLayout.width - nextCursorLayout.width) * progress + nextCursorLayout.width,
        };
      }
    }

    /// 获取动画配置以及旧的布局目标

    const cursorStyleMap = getComputedStyle(cursorEle);
    const { animationDuration, width, paddingLeft, paddingRight } = cursorStyleMap;
    const leftIn = cursorStyleMap.getPropertyValue("--cursor-left-in-easing") || "ease-out";
    const leftOut = cursorStyleMap.getPropertyValue("--cursor-left-out-easing") || "ease-in";
    const rightIn = cursorStyleMap.getPropertyValue("--cursor-right-in-easing") || "ease-in";
    const rightOut = cursorStyleMap.getPropertyValue("--cursor-right-out-easing") || "ease-out";
    const durationMs = cssAnimationDurationToMs(animationDuration);
    const widthPx = parseFloat(width);
    const paddingLeftPx = parseFloat(paddingLeft);
    // const paddingRightPx = parseFloat(paddingRight);

    let diretion: string;
    if (widthPx === 0 || nextCursorLayout.width === 0) {
      diretion = "center";
    } else if (nextCursorLayout.left > paddingLeftPx) {
      diretion = "right";
    } else {
      diretion = "left";
    }

    cursorEleStyle.setProperty("--cursor-from-left", paddingLeft);
    cursorEleStyle.setProperty("--cursor-from-right", paddingRight);

    cursorEleStyle.setProperty("--cursor-to-left", nextCursorLayout.left + "px");
    cursorEleStyle.setProperty("--cursor-to-right", `${widthPx - (nextCursorLayout.left + nextCursorLayout.width)}px`);
    if (useAnimation || true) {
      const optionsDuration = useAnimation ? durationMs : 20;
      const optionsEasing = "ease-in"; // "ease-out" | "linear"
      cursorEle.animate(
        [
          {
            composite: "replace",
            paddingLeft: paddingLeft,
          },
          {
            paddingLeft: `var(--cursor-to-left)`,
          },
        ],
        {
          duration: optionsDuration,
          easing: useAnimation ? (diretion === "right" ? leftOut : leftIn) : optionsEasing,
          fill: "forwards",
        },
      );
      cursorEle.animate(
        [
          {
            composite: "replace",
            paddingRight: paddingRight,
          },
          {
            paddingRight: `var(--cursor-to-right)`,
          },
        ],
        {
          duration: optionsDuration,
          easing: useAnimation ? (diretion === "left" ? rightIn : rightOut) : optionsEasing,
          fill: "forwards",
        },
      );
    }
  }

  render() {
    return (
      <Host onClick={this.onClick}>
        <div class="tab-list" part="tabs">
          <slot name="tab"></slot>
        </div>
        <div class="cursor" part="cursor">
          <div class="spirit" part="spirit"></div>
        </div>
      </Host>
    );
  }
}

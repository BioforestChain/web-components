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
import {
  at,
  cssAnimationDurationToMs,
  Logger,
  microtaskQueue,
  querySelector,
  querySelectorAll,
} from "../../utils/utils";

type CursorLayout = {
  width: number;
  left: number;
};
const DEFAULT_CURSOR_LAYOUT: CursorLayout = { width: 0, left: 0 };

@Component({
  tag: "ccc-slider-tabs",
  styleUrl: "ccc-slider-tabs.scss",
  shadow: true,
})
export class CccSliderTabs implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly logger = new Logger(this.hostEle);
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

  @Prop({ reflect: true, mutable: true }) activedIndex?: number = 0;
  private _canWriteAttr_activedIndex = true;
  @Watch("activedIndex")
  watchActivedIndex() {
    this._canWriteAttr_activedIndex = false;
    const activedIndex =
      (this.activedIndex === undefined ? -1 : Number.isSafeInteger(this.activedIndex) ? this.activedIndex : -1) %
      this._tabElements.length;
    const selectedEle = at(this._tabElements, activedIndex, true);
    // 尝试选中新的tab对象
    this.selectTab(selectedEle);
    // 更新插槽的css属性来做出动画，这里不和 selectTab 一起。因为 activedIndex 可能是小数
    this._effectCursorLayout();
    this._canWriteAttr_activedIndex = true;
  }

  @Event() activedTabChange!: EventEmitter<[HTMLElement | null, number]>;

  private _forEle: HTMLElement | null = null;
  private _onForEleScroll = (event: Event) => {
    event.target;
  };

  private _tabElements: Array<HTMLElement> = [];
  public get tabElements() {
    return this._tabElements;
  }
  public set tabElements(value) {
    this._tabElements = value;
    this.watchActivedIndex();
  }
  private _cursorLayouts: Array<CursorLayout> = [];
  /**
   * 计算底部浮标的布局位置
   */
  @microtaskQueue
  private _calcCursorSlotLayouts() {
    if (!this._tabListEle) {
      return;
    }
    this.logger.log("_calcCursorSlotLayouts");
    const offsetLeftStart = this._tabListEle.offsetLeft;
    const cursorLayouts = this._cursorLayouts;
    for (const tabEle of (this.tabElements = querySelectorAll<HTMLElement>(this.hostEle, '[slot="tab"]'))) {
      const left = tabEle.offsetLeft - offsetLeftStart;
      const width = tabEle.offsetWidth;
      cursorLayouts.push({ left, width });
    }
    this._cursorLayouts = cursorLayouts;
    // 布局变更，重新绘制
    this._effectCursorLayout();
  }

  private _resizeOb = new ResizeObserver(() => {
    this.logger.log("resize");
    this._calcCursorSlotLayouts();
  });
  private _mutationOb = new MutationObserver(() => {
    this.logger.log("mutation");
    this._calcCursorSlotLayouts();
  });
  connectedCallback() {
    this.watchFor();
    this.logger.log("connectedCallback");
  }
  private _tabListEle?: HTMLElement;
  private _cursorEle?: HTMLElement;
  componentDidLoad() {
    this.logger.log("componentDidLoad");
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
        ? _forEle
        : null
      : null;
    if (forEle !== _forEle) {
      this.logger.error("for attribute can only binding <ccc-slider> element");
    }
    if (forEle === this._forEle) {
      return;
    }
    /// 解绑
    if (this._forEle) {
      this._forEle.removeEventListener("scroll", this._onForEleScroll);
    }

    /// 绑定
    if (forEle) {
      this._forEle = forEle;
      forEle.addEventListener("scroll", this._onForEleScroll);
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
  private _onClick = (event: MouseEvent) => {
    const ele = event.target ? (event.target instanceof HTMLElement ? event.target : null) : null;
    if (!ele) {
      return;
    }
    this.selectTab(ele.closest<HTMLElement>(`[slot="tab"]`));
    // 更新插槽的css属性来做出动画
    this._effectCursorLayout();
  };
  private selectTab(_newTabEle?: HTMLElement | null) {
    const newTabEle = _newTabEle instanceof HTMLElement ? _newTabEle : null;
    const oldTabEle = this._activiedTabEle;
    if (newTabEle === oldTabEle) {
      return;
    }
    oldTabEle?.removeAttribute("data-slider-tabs");
    newTabEle?.setAttribute("data-slider-tabs", "actived");
    const activedIndex = newTabEle ? this._tabElements.indexOf(newTabEle) : -1;

    /// 更新属性
    this._activiedTabEle = newTabEle; // 务必要先写入这个值，因为后面activedIndex的写入会引发selectTab被在此调用
    if (this._canWriteAttr_activedIndex) {
      this.activedIndex = activedIndex;
    }

    /// 触发事件更新
    this.activedTabChange.emit([newTabEle, activedIndex]);
  }

  /**引用游标的插槽布局 */
  @microtaskQueue
  private _effectCursorLayout() {
    this.logger.log("_effectCursorLayout");

    const cursorEle = this._cursorEle;
    if (cursorEle) {
      const cursorEleStyle = cursorEle.style;
      /// 获取新的布局目标
      let nextCursorLayout = DEFAULT_CURSOR_LAYOUT;
      const { activedIndex } = this;
      let useAnimation = true;

      if (activedIndex !== undefined) {
        const progress = activedIndex % 1;
        const cursorLayout = at(this._cursorLayouts, activedIndex, true);
        if (cursorLayout) {
          nextCursorLayout = cursorLayout;
        }
        /// 如果有特殊的进度，那么不使用动画，直接依赖于属性过去
        if (progress !== 0) {
          useAnimation = false;
          const cursorLayout = at(this._cursorLayouts, activedIndex + 1, true);
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
      cursorEleStyle.setProperty(
        "--cursor-to-right",
        `${widthPx - (nextCursorLayout.left + nextCursorLayout.width)}px`,
      );
      if (useAnimation) {
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
            duration: durationMs,
            easing: diretion === "right" ? leftOut : leftIn,
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
            duration: durationMs,
            easing: diretion === "left" ? rightIn : rightOut,
            fill: "forwards",
          },
        );
      }
    }
  }

  render() {
    return (
      <Host onClick={this._onClick}>
        <div class="tab-list" part="tabs">
          <slot name="tab"></slot>
        </div>
        <slot></slot>
        <div class="cursor" part="cursor">
          <div class="spirit" part="spirit"></div>
        </div>
      </Host>
    );
  }
}

import { Component, ComponentInterface, Element, h, Host, Method, Prop, Watch } from "@stencil/core";
import { asSafeInteger, cssAnimationDurationToMs, Logger, querySelector } from "../../utils/utils";
import { $CccLayout, $CccSlider, isCccLayout, isCccSlider } from "./ccc-slider.const";

export type $Cursor = {
  index: number;
  width: number;
  left: number;
};

@Component({
  tag: "ccc-slider-scrollbar",
  styleUrl: "ccc-slider-scrollbar.scss",
  shadow: true,
})
export class CccSliderScrollbar implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);
  //#region 与 slider 元素通过 for 属性进行联动绑定；
  /**
   * the `$CccSlider` element id
   */
  @Prop({}) forSlider?: string;
  @Watch("forSlider")
  watchForSlider(forSlider: string | undefined) {
    return this._bindSliderElement(forSlider ? querySelector(document, `#${forSlider}`) : null);
  }
  private _sliderEle: $CccSlider.HTMLCccSliderElement | null = null;

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
    this.console.info("bind slider", sliderEle);
    /// 解绑
    const oldSliderEle = this._sliderEle;
    if (oldSliderEle) {
      this._sliderEle = null;
      oldSliderEle.removeEventListener("activedIndexChange", this._for_onActivedSliderChange);
      oldSliderEle.removeEventListener("scroll", this._for_onEleScroll);
      oldSliderEle.removeEventListener("scrollend", this._for_onEleScroll);
    }

    /// 绑定
    if (sliderEle) {
      this._sliderEle = sliderEle;
      sliderEle.addEventListener("activedIndexChange", this._for_onActivedSliderChange);
      sliderEle.addEventListener("scroll", this._for_onEleScroll);
      sliderEle.addEventListener("scrollend", this._for_onEleScroll);
      // 立刻进行渲染绑定
      await this._followSliderElement(sliderEle, "init");
    }
    return sliderEle;
  }

  private _for_onActivedSliderChange = (event: CustomEvent<$CccSlider.ActivedIndexChangeDetail>) => {
    const ele = event.target as $CccSlider.HTMLCccSliderElement;
    if (ele !== this._sliderEle) {
      return;
    }
    return this._followSliderElement(ele, event.type);
  };

  private _for_onEleScroll = (event: Event) => {
    const ele = event.target as $CccSlider.HTMLCccSliderElement;
    if (ele !== this._sliderEle) {
      return;
    }
    return this._followSliderElement(ele, event.type);
  };
  private async _followSliderElement(ele: $CccSlider.HTMLCccSliderElement, _reason?: unknown) {
    const scrollProgress = await ele.getScrollProgress();
    const aniProgress = this._scrollProgressToAniProgress(scrollProgress);
    this._playAnimations(aniProgress);
    this.console.log("follow slider", _reason, scrollProgress, aniProgress);
  }
  //#endregion

  //#region 与 layout 元素通过 for 属性进行联动绑定；

  /**
   * the `$CccLayout` element id
   */
  @Prop({}) forLayout?: string;
  @Watch("forLayout")
  watchForLayout(forLayout: string | undefined) {
    return this._bindLayoutElement(forLayout ? querySelector(document, `#${forLayout}`) : null);
  }
  private _layoutEle: $CccLayout.HTMLCccLayoutElement | null = null;

  /**
   * 手动绑定或者解绑 for 元素
   * 从而让 `$CccLayout` 元素能主动 根据自己的生命周期来与 scrollbar 进行绑定联动
   */
  @Method()
  async bindLayoutElement(_layoutEle?: $CccLayout.HTMLCccLayoutElement | null) {
    await this._bindLayoutElement(_layoutEle);
  }
  private async _bindLayoutElement(_layoutEle?: HTMLElement | null) {
    const layoutEle = isCccLayout(_layoutEle) ? _layoutEle : null;
    if (layoutEle !== _layoutEle) {
      this.console.error("for attribute can only binding <ccc-layout> element");
    }
    if (layoutEle === this._sliderEle) {
      return;
    }
    this.console.info("bind layout", layoutEle);
    /// 解绑
    const oldLayoutEle = this._layoutEle;
    if (oldLayoutEle) {
      this._layoutEle = null;
      oldLayoutEle.removeEventListener("layoutChange", this._for_onLayoutChange);
    }

    /// 绑定
    const newLayoutEle = layoutEle;
    if (newLayoutEle) {
      this._layoutEle = newLayoutEle;
      newLayoutEle.addEventListener("layoutChange", this._for_onLayoutChange);
      // 立刻进行渲染绑定
      await this._followLayoutElement(newLayoutEle, "init");
    }
    return layoutEle;
  }

  private _for_onLayoutChange = (event: CustomEvent<$CccLayout.LayoutChangeDetail>) => {
    const ele = event.target as $CccLayout.HTMLCccLayoutElement;
    if (ele !== this._layoutEle) {
      return;
    }
    return this._followLayoutElement(ele, event.type);
  };

  private async _followLayoutElement(ele: $CccLayout.HTMLCccLayoutElement, _reason: unknown) {
    this.console.log("follow layout", _reason);
    const layoutInfo = await ele.getLayoutInfo();
    let accLeft = 0;
    this._cursorList = layoutInfo.blockList.map((block, i) => {
      const cursor = { index: i, width: block.size, left: accLeft };
      accLeft += block.size;
      return cursor;
    });
    // 更新插槽的css属性来做出动画
    this._prepareAnimations();
    if (this._sliderEle) {
      this._followSliderElement(this._sliderEle, "prepared");
    }
  }
  //#endregion

  //#region 渲染与动画
  @Prop() duration?: number;

  private _cursorEle?: HTMLElement;
  private _cursorList: $Cursor[] = [];

  /// 将布局信息反应到css动画上
  private _anis: Animation[] = [];
  private _aniTotalDuration = 0;
  private _prepareAnimations() {
    const { _cursorEle: cursorEle, _cursorList: cursorList } = this;
    if (!cursorEle) {
      return;
    }

    /// 取消原有的动画
    for (const ani of this._anis) {
      ani.cancel();
    }
    this._anis.length = 0;

    /// 生成新的动画
    const leftList = [0];
    const rightList = [0];
    const offsetList = [0];
    const widthList = [1];

    if (cursorList) {
      const totalWidth = cursorList.reduce((w, c) => w + c.width, 0);
      const unitOffset = 1 / cursorList.length;
      for (const cursor of cursorList) {
        const offset = offsetList.length * unitOffset;
        offsetList.push(offset);

        const width = cursor.width / totalWidth;
        widthList.push(width);

        // const left = cursor.left / totalWidth;
        // leftList.push(left / width);
        leftList.push(cursor.left);

        const right = (totalWidth - cursor.left - cursor.width) / totalWidth;
        rightList.push(right / width);
      }
    }

    const cursorAniDuration =
      asSafeInteger(this.duration) ??
      (cssAnimationDurationToMs(getComputedStyle(cursorEle).animationDuration) ||
        1); /* 不小于等于0，避免计算toTime的时候出错 */

    const totalDuration = (offsetList.length - 1) * cursorAniDuration;
    this._aniTotalDuration = totalDuration;
    const leftAni = cursorEle.animate(
      {
        // easing: `ease-in`,
        offset: offsetList,
        transform: leftList.map(left => `translateX(${left}px)`),
      },
      {
        easing: "linear",
        duration: totalDuration,
        fill: "forwards",
      },
    );
    leftAni.pause();
    const rightAni = cursorEle.animate(
      {
        // easing: `ease-out`,
        offset: offsetList,
        width: widthList.map(width => `${width * 100}%`),
      },
      {
        easing: "linear",
        duration: totalDuration,
        fill: "forwards",
      },
    );
    rightAni.pause();
    this._anis.push(leftAni, rightAni);

    this.console.log("animate-offset", offsetList);
    this.console.log("animate-left", leftList);
    this.console.log("animate-width", widthList);
    this.console.log("animate-right", rightList);
  }

  private _scrollProgressToAniProgress(scrollProgress: number) {
    if (this._cursorList.length > 0) {
      return (1 + scrollProgress) / this._cursorList.length;
    }
    return 0;
  }

  private _playFrameId?: number;
  private _playAnimations(toAniProgress: number) {
    const baseAni = this._anis[0];
    if (!baseAni) {
      return;
    }
    if (Number.isFinite(toAniProgress) === false) {
      return;
    }

    if (toAniProgress < 0) {
      toAniProgress = 0;
    } else if (toAniProgress > 1) {
      toAniProgress = 1;
    }
    const toTime = toAniProgress * this._aniTotalDuration;
    const getCurTime = () => baseAni.currentTime ?? 0;
    const fromTime = getCurTime();
    if (toTime === fromTime) {
      return;
    }

    debugger;
    this.console.log("play animations to", (toAniProgress * 100).toFixed(2) + "%");
    let playRate: 1 | -1;
    /// 一帧帧检查是否播放到特定的进度
    let checkFinish: (curTime: number) => boolean;
    /// 正向播放，AniProgress越来越大
    if (fromTime < toTime) {
      checkFinish = curTime => curTime >= toTime;
      playRate = 1;
    }
    /// 方向播放，AniProgress越来越小
    else {
      checkFinish = curTime => curTime <= toTime;
      playRate = -1;
    }
    const doPlayAni = () => {
      let curTime = getCurTime();
      if (checkFinish(curTime)) {
        curTime = toTime;
        this._playFrameId = undefined;
        for (const ani of this._anis) {
          ani.currentTime = curTime;
          ani.pause();
        }
      } else {
        this._playFrameId = requestAnimationFrame(doPlayAni);
      }
    };

    /// 先暂停
    this._pauseAnimations();
    /// 再重启
    for (const ani of this._anis) {
      ani.playbackRate = playRate;
      ani.play();
    }
    this._playFrameId = requestAnimationFrame(doPlayAni);
  }
  private _pauseAnimations() {
    if (this._playFrameId === undefined) {
      return;
    }
    cancelAnimationFrame(this._playFrameId);
    this._playFrameId = undefined;

    for (const ani of this._anis) {
      ani.pause();
    }
  }
  //#endregion

  componentDidLoad() {
    this._cursorEle = querySelector(this.hostEle.shadowRoot, ".cursor");

    this.watchForLayout(this.forLayout);
    this.watchForSlider(this.forSlider);
  }
  connectedCallback() {
    this._bindLayoutElement(null);
    this._bindLayoutElement(null);
  }

  render() {
    return (
      <Host>
        <div class="cursor" part="cursor">
          <div class="spirit" part="spirit"></div>
        </div>
      </Host>
    );
  }
}

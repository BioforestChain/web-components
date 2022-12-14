import { Component, ComponentInterface, Element, h, Host, Method, Prop, Watch } from "@stencil/core";
import {
  asSafeInteger,
  at,
  cssAnimationDurationToMs,
  Logger,
  queryScopeSelector,
  querySelector,
} from "../../utils/utils";
import { $BnLayout, $BnSlider, isBnLayout, isBnSlider } from "./bn-slider.const";

export type $Cursor = {
  index: number;
  width: number;
  left: number;
};

@Component({
  tag: "bn-slider-scrollbar",
  styleUrl: "bn-slider-scrollbar.scss",
  shadow: true,
})
export class BnSliderScrollbar implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);
  //#region 与 slider 元素通过 for 属性进行联动绑定；
  /**
   * the `$BnSlider` element id
   */
  @Prop({}) forSlider?: string;
  @Watch("forSlider")
  watchForSlider(forSlider: string | undefined) {
    return this._bindSliderElement(forSlider ? queryScopeSelector(this.hostEle, `#${forSlider}`) : null);
  }
  private _sliderEle: $BnSlider.HTMLBnSliderElement | null = null;

  /**
   * 手动绑定或者解绑 for 元素
   * 从而让 `<bn-slider>` 元素能主动 根据自己的生命周期来与 tabs 进行绑定联动
   * @param _sliderEle
   * @returns
   */
  @Method()
  async bindSliderElement(_sliderEle?: HTMLElement | null) {
    await this._bindSliderElement(_sliderEle);
  }
  private async _bindSliderElement(_sliderEle?: HTMLElement | null) {
    const sliderEle = isBnSlider(_sliderEle) ? _sliderEle : null;
    if (sliderEle !== _sliderEle && _sliderEle != undefined) {
      this.console.error("for attribute can only binding <bn-slider> element");
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

  private _for_onActivedSliderChange = (event: CustomEvent<$BnSlider.ActivedIndexChangeDetail>) => {
    const ele = event.target as $BnSlider.HTMLBnSliderElement;
    if (ele !== this._sliderEle) {
      return;
    }
    return this._followSliderElement(ele, event.type);
  };

  private _for_onEleScroll = async (event: Event) => {
    /// 减少计算，使得动画尽可能平顺
    if (this._preProgress < 0.5) {
      return;
    }
    const ele = event.target as $BnSlider.HTMLBnSliderElement;
    if (ele !== this._sliderEle) {
      return;
    }
    const reason = await ele.getReason();
    // if (reason === "user") {
    return this._followSliderElement(ele, `(reason: ${reason} ${event.type})`);
    // }
  };
  private async _followSliderElement(ele: $BnSlider.HTMLBnSliderElement, _reason?: unknown) {
    const scrollProgress = await ele.getScrollProgress();
    const aniProgress = this._scrollProgressToAniProgress(scrollProgress);
    this._playAnimations(aniProgress);
    this.console.lazyLog(() => [
      "follow slider",
      _reason,
      "scroll-progress:",
      +scrollProgress.toFixed(3),
      "animation-progress:",
      +aniProgress.toFixed(3),
    ]);
  }
  //#endregion

  //#region 与 layout 元素通过 for 属性进行联动绑定；

  /**
   * the `$BnLayout` element id
   */
  @Prop({}) forLayout?: string;
  @Watch("forLayout")
  watchForLayout(forLayout: string | undefined) {
    return this._bindLayoutElement(forLayout ? queryScopeSelector(this.hostEle, `#${forLayout}`) : null);
  }
  private _layoutEle: $BnLayout.HTMLBnLayoutElement | null = null;

  /**
   * 手动绑定或者解绑 for 元素
   * 从而让 `$BnLayout` 元素能主动 根据自己的生命周期来与 scrollbar 进行绑定联动
   */
  @Method()
  async bindLayoutElement(_layoutEle?: $BnLayout.HTMLBnLayoutElement | null) {
    await this._bindLayoutElement(_layoutEle);
  }
  private async _bindLayoutElement(_layoutEle?: HTMLElement | null) {
    const layoutEle = isBnLayout(_layoutEle) ? _layoutEle : null;
    if (layoutEle !== _layoutEle && _layoutEle != undefined) {
      this.console.error("for attribute can only binding <bn-layout> element");
    }
    if (layoutEle === this._layoutEle) {
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

  private _for_onLayoutChange = (event: CustomEvent<$BnLayout.LayoutChangeDetail>) => {
    const ele = event.target as $BnLayout.HTMLBnLayoutElement;
    if (ele !== this._layoutEle) {
      return;
    }
    return this._followLayoutElement(ele, event.type);
  };

  private async _followLayoutElement(ele: $BnLayout.HTMLBnLayoutElement, _reason: unknown) {
    this.console.log("follow layout", _reason);
    const layoutInfo = await ele.getLayoutInfo();
    this._calcCursorLayout(layoutInfo);
    // 更新动画
    if (this._sliderEle) {
      this._followSliderElement(this._sliderEle, "prepared");
    }
  }
  //#endregion

  //#region 渲染与动画
  @Prop() duration?: number;

  // private _cursorEle?: HTMLElement;
  private _eles?: {
    cursor: HTMLElement;
    leftIn: HTMLElement;
    leftOut: HTMLElement;
    rightIn: HTMLElement;
    rightOut: HTMLElement;
  };

  private _cursorList: $Cursor[] = [];
  private _cursorTotalWidth: number = 0;
  private _calcCursorLayout(layoutInfo: $BnLayout.LayoutChangeDetail) {
    /// 计算光标的基本布局的布局
    let accLeft = 0;
    this._cursorList = layoutInfo.blockList.map((block, i) => {
      const cursor = { index: i, width: block.size, left: block.start };
      accLeft = block.start + block.size;
      return cursor;
    });
    this._cursorTotalWidth = accLeft;
  }

  /// 将布局信息反应到css动画上
  private _anis: Animation[] = [];
  private _aniDuration = 0;

  private _prepareAnimations(eles = this._eles) {
    if (!eles) {
      return;
    }

    /// 取消原有的动画
    if (this._playFrameId !== undefined) {
      cancelAnimationFrame(this._playFrameId);
      this._playFrameId = undefined;
    }
    for (const ani of this._anis) {
      ani.cancel();
    }
    this._anis.length = 0;

    /// 生成四向动画
    const cursorStyles = getComputedStyle(eles.cursor);
    const cursorAniDuration =
      asSafeInteger(this.duration) ??
      (cssAnimationDurationToMs(cursorStyles.animationDuration) || 1); /* 不小于等于0，避免计算toTime的时候出错 */
    this._aniDuration = cursorAniDuration;

    const leftInEasing = cursorStyles.getPropertyValue("--cursor-left-in-easing") || "ease-out";
    const leftOutEasing = cursorStyles.getPropertyValue("--cursor-left-out-easing") || "ease-in";
    const rightInEasing = cursorStyles.getPropertyValue("--cursor-right-in-easing") || "ease-out";
    const rightOutEasing = cursorStyles.getPropertyValue("--cursor-right-out-easing") || "ease-in";

    const generateAnimation = (
      ele: HTMLElement,
      keyframes: PropertyIndexedKeyframes,
      options: KeyframeAnimationOptions,
    ) => {
      const ani = ele.animate(keyframes, options);
      ani.pause();
      this._anis.push(ani);
    };
    const keyframes: PropertyIndexedKeyframes = {
      transform: [`scale(1)`, `scale(101)`],
    };
    // const keyframes: PropertyIndexedKeyframes = {
    //   top: ["0px", "1000px"],
    // };

    generateAnimation(eles.leftIn, keyframes, {
      easing: leftInEasing,
      duration: cursorAniDuration,
      fill: "forwards",
    });
    generateAnimation(eles.leftOut, keyframes, {
      easing: leftOutEasing,
      duration: cursorAniDuration,
      fill: "forwards",
    });
    generateAnimation(eles.rightIn, keyframes, {
      easing: rightInEasing,
      duration: cursorAniDuration,
      fill: "forwards",
    });
    generateAnimation(eles.rightOut, keyframes, {
      easing: rightOutEasing,
      duration: cursorAniDuration,
      fill: "forwards",
    });
  }
  private _getAniProgress(ele: HTMLElement) {
    return (ele.getBoundingClientRect().width - 1) / 100;
  }
  // private _getAniProgress(ele: HTMLElement) {
  //   return ele.offsetTop / 1000;
  // }

  private _scrollProgressToAniProgress(scrollProgress: number) {
    if (this._cursorList.length > 0) {
      return scrollProgress / (this._cursorList.length - 1);
    }
    return 0;
  }

  private _calcAnimateLayout(progress: number) {
    const index = progress * (this._cursorList.length - 1);
    const float = index % 1;
    const int = index - float;
    const base = at(this._cursorList, int);
    if (!base) {
      return { left: 0, width: 0 };
    }
    if (float === 0) {
      return base;
    }
    const next = at(this._cursorList, int + 1)!;
    const mix = {
      left: base.left + (next.left - base.left) * float,
      width: base.width + (next.width - base.width) * float,
    };
    return mix;
  }

  private _playFrameId?: number;
  /**滚动动画的进度 */
  private _aniProgress: number = 0;
  /**当前动画控制器的进度 */
  private _preProgress = 0;
  private _playAnimations(toAniProgress: number, duration = this._aniDuration) {
    if (this._anis.length === 0) {
      return;
    }
    if (this._eles === undefined) {
      return;
    }

    const [leftInAni, leftOutAni, rightInAni, rightOutAni] = this._anis;
    const {
      leftIn: leftInEle,
      leftOut: leftOutEle,
      rightIn: rightInEle,
      rightOut: rightOutEle,
      cursor: cursorEle,
    } = this._eles;
    if (Number.isFinite(toAniProgress) === false) {
      return;
    }

    if (toAniProgress < 0) {
      toAniProgress = 0;
    } else if (toAniProgress > 1) {
      toAniProgress = 1;
    }

    /// 先注销原先的所有动画钩子
    if (this._playFrameId !== undefined) {
      this.console.verbose("cancel play animation");
      cancelAnimationFrame(this._playFrameId);
    }

    /// 计算出动画目标

    const cursorStyle = cursorEle.style;
    const totalWidth = this._cursorTotalWidth;
    let fromLeft = 0;
    let fromRight = 0;
    {
      const { left, width } = cursorStyle;
      fromLeft = parseFloat(left);
      fromRight = totalWidth - parseFloat(width) - fromLeft;
    }
    let toLeft = 0;
    let toRight = 0;
    {
      const { left, width } = this._calcAnimateLayout(toAniProgress);
      toLeft = left;
      toRight = totalWidth - width - toLeft;
    }

    const fromAniProgress = this._aniProgress;
    const baseAniDuration = this._aniDuration;
    /**播放速率 */
    const playbackBaseRate = 1 / Math.min(Math.abs(toAniProgress - fromAniProgress) * this._cursorList.length, 1);

    const doFinishAni = () => {
      this._anis.forEach(ani => ani.pause());
      const widthPx = totalWidth - toLeft - toRight;
      cursorStyle.cssText = `left:${toLeft}px; width:${widthPx}px;`;
    };

    let leftAni: Animation;
    let leftEle: HTMLElement;
    let rightAni: Animation;
    let rightEle: HTMLElement;

    if (duration === 0 || Number.isFinite(playbackBaseRate) === false) {
      doFinishAni();
      return;
    }
    /// 正向
    if (toAniProgress > fromAniProgress) {
      leftAni = leftOutAni;
      leftEle = leftOutEle;

      rightAni = rightInAni;
      rightEle = rightInEle;
    } /// 反向
    else if (toAniProgress < fromAniProgress) {
      leftAni = leftInAni;
      leftEle = leftInEle;

      rightAni = rightOutAni;
      rightEle = rightOutEle;
    }
    /// 已经完成动画了 fromAniProgress === toAniProgress
    else if (fromLeft !== toLeft || fromRight !== toRight) {
      doFinishAni();
      return;
    } else {
      return;
    }
    const doPlayAni = () => {
      let progress: number;
      if (leftAni.playState === "finished") {
        this._playFrameId = undefined;
        progress = 1;
      } else {
        this._playFrameId = requestAnimationFrame(doPlayAni);
        progress = (leftAni.currentTime ?? 0) / baseAniDuration;
      }
      // const progress = (leftAni.currentTime ?? 0) / baseAniDuration;
      this._aniProgress = fromAniProgress + (toAniProgress - fromAniProgress) * progress;
      this._preProgress = progress;

      const leftProgress = this._getAniProgress(leftEle);
      const leftPx = fromLeft + (toLeft - fromLeft) * leftProgress;

      const rightProgress = this._getAniProgress(rightEle);
      const rightPx = fromRight + (toRight - fromRight) * rightProgress;
      const widthPx = totalWidth - leftPx - rightPx;

      cursorStyle.cssText = `left:${leftPx}px; width:${widthPx}px`;

      this.console.verbose("play animation frame!", "progress:", +(progress * 100).toFixed(2));
    };

    const playbackRate = (baseAniDuration / duration) * playbackBaseRate;

    for (const ani of this._anis) {
      if (ani === leftAni || ani === rightAni) {
        /// 如果已经在动画中了，那么改变它的播放速率就好了
        if (ani.playState === "running") {
          /* @TODO 这里应该有更好的算法来使得特效更加符合预期? */
          ani.currentTime = ani.currentTime! * Math.SQRT1_2;
          ani.playbackRate = playbackRate;
        }
        /// 否则重新开始动画
        else {
          ani.playbackRate = playbackRate;
          ani.currentTime = 0;
          ani.play();
        }
      } else {
        ani.pause();
      }
    }

    /// 开始根据双向动画跟进渲染
    this._preProgress = 0;
    this._playFrameId = requestAnimationFrame(doPlayAni);
  }

  async componentDidLoad() {
    const eles = (this._eles = {
      cursor: querySelector(this.hostEle.shadowRoot, ".cursor")!,
      leftIn: querySelector(this.hostEle.shadowRoot, ".left-in")!,
      leftOut: querySelector(this.hostEle.shadowRoot, ".left-out")!,
      rightIn: querySelector(this.hostEle.shadowRoot, ".right-in")!,
      rightOut: querySelector(this.hostEle.shadowRoot, ".right-out")!,
    });
    this._prepareAnimations(eles);

    await this.watchForLayout(this.forLayout);
    await this.watchForSlider(this.forSlider);
  }
  async disconnectedCallback() {
    await this._bindLayoutElement(null);
    await this._bindSliderElement(null);
  }
  @Method()
  async update() {
    /// 更新动画相关的属性
    this._prepareAnimations();
    if (this._layoutEle) {
      await this._followLayoutElement(this._layoutEle, "update");
    }
    if (this._sliderEle) {
      await this._followSliderElement(this._sliderEle, "update");
    }
  }

  render() {
    return (
      <Host>
        <div
          class="cursor"
          part="cursor"
          style={{
            left: "0px",
            width: "100%",
          }}
        >
          <div class="spirit" part="spirit"></div>
          <div class="ani-shadow">
            <div class="ani-item left-in"></div>
            <div class="ani-item left-out"></div>
            <div class="ani-item right-in"></div>
            <div class="ani-item right-out"></div>
          </div>
        </div>
      </Host>
    );
  }
}

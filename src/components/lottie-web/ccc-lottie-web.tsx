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
import lottie, { AnimationItem, RendererType } from "lottie-web";
import { querySelectorAll } from "../../utils/utils";
import { forceGetColors } from "./ccc-lottie-web-toggle-button.const";

export interface BMEnterFrameEvent {
  currentTime: number;
  direction: number;
  totalTime: number;
  type: "enterFrame";
}

@Component({
  tag: "ccc-lottie-web",
  styleUrl: "ccc-lottie-web.scss",
  shadow: true,
})
export class CccLottieWeb implements ComponentInterface {
  @Element() private _hostEle!: HTMLElement;
  connectedCallback(): void {
    this._initLottie();
  }

  @Prop({ mutable: true }) defaultActivedColor = "";
  @Event() defaultActivedColorChange!: EventEmitter<string>;

  @Event() startFrame!: EventEmitter<void>;
  @Event() endFrame!: EventEmitter<void>;
  // @Event() enterFrame!: EventEmitter<BMEnterFrameEvent>;
  // @Event() loopComplete!: EventEmitter<void>;
  // @Event() segmentStart!: EventEmitter<void>;
  // @Event() destroy!: EventEmitter<void>;
  // @Event() config_ready!: EventEmitter<void>;
  // @Event() data_ready!: EventEmitter<void>;
  // @Event() data_failed!: EventEmitter<void>;
  // @Event() loaded_images!: EventEmitter<void>;

  private _initLottie() {
    if (this._lottieAniIns) {
      return;
    }
    const lottieAniIns = (this._lottieAniIns = lottie.loadAnimation({
      container: this._hostEle.shadowRoot as any, // Required
      // path: this.src,
      animationData: this.data,
      renderer: this.renderer,
      loop: this.loop,
      autoplay: this.autoplay,
      name: this.name,
    }));
    // for (const eventName of [
    //   "loopComplete",
    //   "segmentStart",
    //   "destroy",
    //   "config_ready",
    //   "data_failed",
    //   "loaded_images",
    // ] as const) {
    //   lottieAniIns.addEventListener(eventName, event => {
    //     this[eventName].emit(event);
    //   });
    // }

    // lottieAniIns.addEventListener<BMEnterFrameEvent>("enterFrame", event => {
    //   this.enterFrame.emit(event);
    // });
    lottieAniIns.addEventListener("complete", () => {
      this.endFrame.emit();
    });

    if (lottieAniIns.isLoaded) {
      this._firstLoad(lottieAniIns);
    } else {
      lottieAniIns.addEventListener("data_ready", () => {
        this._firstLoad(lottieAniIns);
      });
    }
  }

  private async _firstLoad(lottieAniIns: AnimationItem) {
    const colors = forceGetColors(this.data!);
    if (!colors.checked) {
      /// 跳到最后一帧，获取主色调
      this.goToAndStop(lottieAniIns.totalFrames, true);
      colors.checked = await this.getPrimaryColor();
      this.goToAndStop(0, true);
    }
    this.defaultActivedColor = colors.checked;
    this.defaultActivedColorChange.emit(this.defaultActivedColor);
    // this._hostEle.style.setProperty("--default-actived-color", colors.checked);
    // 在初始化完毕的时候，如果处于激活状态，那么将之激活
    if (this.actived) {
      lottieAniIns.goToAndPlay(lottieAniIns.totalFrames, true);
    }
    // this.data_ready.emit();
  }

  private _doPlay(lottieAniIns: AnimationItem) {
    this.startFrame.emit();
    if (this.actived) {
      lottieAniIns.setDirection((this.direction = 1));
      lottieAniIns.setSpeed(1);
      lottieAniIns.play();
    } else {
      lottieAniIns.setDirection((this.direction = -1));
      lottieAniIns.setSpeed(lottieAniIns.totalFrames / 2);
      lottieAniIns.play();
    }
  }

  disconnectedCallback(): void {
    this._lottieAniIns?.destroy();
  }
  private _lottieAniIns?: AnimationItem;
  /**
   * 是否要将动画至于末尾帧？
   */
  @Prop() actived = false;
  @Watch("actived")
  watchActivedHanlder() {
    if (this._lottieAniIns) {
      this._doPlay(this._lottieAniIns);
    }
  }

  /**
   * 渲染类型
   */
  @Prop() renderer: RendererType = "svg";
  @Prop() loop = false;
  @Prop() autoplay = false;
  @Prop() name = "";
  @Prop({ reflect: true, mutable: true }) direction: 1 | -1 = 1;

  @Watch("renderer")
  @Watch("loop")
  @Watch("autoplay")
  @Watch("name")
  watchLottiePropHanlder() {
    const lottieAniIns = this._lottieAniIns;
    if (lottieAniIns) {
      lottieAniIns.renderer = this.renderer;
      lottieAniIns.loop = this.loop;
      lottieAniIns.autoplay = this.autoplay;
      lottieAniIns.name = this.name;
    }
  }

  @Prop() src: string | undefined = undefined;
  @Prop({ attribute: null }) data: object | undefined = undefined;

  @Watch("src")
  @Watch("data")
  async watchLottieoOptionsHanlder() {
    if (this.data === undefined && this.src) {
      this.data = await fetch(this.src).then(
        res => res.json(),
        err => this._hostEle.dispatchEvent(new CustomEvent("error", { detail: err })),
      );
    }
    if (this.data) {
      this._initLottie();
    }
  }

  @Event() countChanged!: EventEmitter<number>;

  //#region 暴露出一些基本的方法
  @Method()
  async getInstance() {
    return this._lottieAniIns;
  }

  @Method()
  async play(name?: string) {
    return this._lottieAniIns?.play(name);
  }
  @Method()
  async pause(name?: string) {
    return this._lottieAniIns?.pause(name);
  }
  @Method()
  async togglePause(name?: string) {
    return this._lottieAniIns?.togglePause(name);
  }
  @Method()
  async goToAndPlay(value: number, isFrame?: boolean, name?: string) {
    return this._lottieAniIns?.goToAndPlay(value, isFrame, name);
  }
  @Method()
  async goToAndStop(value: number, isFrame?: boolean, name?: string) {
    return this._lottieAniIns?.goToAndStop(value, isFrame, name);
  }
  @Method()
  async getDuration(isFrame?: boolean) {
    return this._lottieAniIns?.getDuration(isFrame);
  }
  //#endregion

  @Method()
  async getPrimaryColor() {
    let primaryColor = "inherit";

    const fillPathMap = new Map<string, number>();
    const hiddenGSet = new Set<SVGGElement>();
    for (const g1 of querySelectorAll<SVGGElement>(this._hostEle.shadowRoot, 'g[opacity="0"]')) {
      hiddenGSet.add(g1);
      for (const g2 of querySelectorAll<SVGGElement>(g1, "g")) {
        hiddenGSet.add(g2);
      }
    }
    for (const gEle of querySelectorAll<SVGGElement>(this._hostEle.shadowRoot, "g")) {
      if (hiddenGSet.has(gEle)) {
        continue;
      }
      for (const pathWithFillEle of querySelectorAll<SVGPathElement>(gEle, "path[fill]") ?? []) {
        const fill = pathWithFillEle.getAttribute("fill");
        const dLength = (pathWithFillEle.getAttribute("d") ?? "").length;
        if (fill && fill !== "rgb(255,255,255)" && fill !== "rgb(0,0,0)") {
          fillPathMap.set(fill, dLength + (fillPathMap.get(fill) ?? 0));
        }
      }
    }
    if (fillPathMap.size > 0) {
      primaryColor = [...fillPathMap].sort((a, b) => b[1] - a[1])[0][0];
    }
    return primaryColor;
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

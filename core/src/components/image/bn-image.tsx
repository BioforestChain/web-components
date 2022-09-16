import { Component, ComponentInterface, Element, h, Host, Method, Prop, State, Watch } from "@stencil/core";
import { imageProvider } from "../../utils/imageProvider";
import { createElements, Logger, manyQuerySelectorAll } from "../../utils/utils";
import { EventBindingHelper } from "../util/eventBinding.helper";
import { SlotChangeHelper } from "../util/slotChange.helper";

const toHref = (src: string) => new URL(src, document.baseURI).href;
const parseWH = (wh?: number) => {
  if (wh !== undefined && Number.isFinite(wh) && wh >= 0) {
    return `${wh}px`;
  }
  return "100%";
};

@Component({
  tag: "bn-image",
  styleUrl: "bn-image.scss",
  shadow: true,
})
export class BnImage implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  @Prop({ reflect: true }) pixelRatio: number = devicePixelRatio;
  @Prop({ reflect: true }) width?: number;
  @Prop({ reflect: true }) height?: number;
  @Prop({ reflect: true }) loading?: "lazy" | "auto" | "eager";
  @Prop({ reflect: true }) alt?: string;
  @Prop({ reflect: true }) src?: string;
  @Prop({ reflect: true }) crossOrigin?: "anonymous" | "use-credentials";

  /**当前显示图片的url，随着data属性的变更与provider的变更，currentSrc会发生变化 */
  @Prop({ mutable: true }) currentSrc: string = "";
  private _setCurrentSrc(current_src: string = "", force = false) {
    if (this.currentSrc === current_src && force === false) {
      return false;
    }
    this.currentSrc = current_src;
    for (const ele of manyQuerySelectorAll<HTMLImageElement>(this._slotEles, "img")) {
      ele.src = current_src;
    }
    /** 这个状态始终要跟着内部的img的属性走 */
    if (this.currentSrc !== current_src) {
      this.status = "loading";
    }
    return true;
  }
  @Watch("src")
  async watchSrc(src?: string) {
    return this._setCurrentSrc(src && (await this._getCurrentSrc(src)));
  }
  private _getCurrentSrc(src: string) {
    return imageProvider.transformFromElement(toHref(src), this.hostEle);
  }

  @State() private status: "loading" | "success" | "error" = "loading";
  private _onError = () => {
    this.console.warn("fail to load image:", this.currentSrc);

    this.status = "error";
    /// 网络发生变更的时候，触发重新绑定
    this._onOnlineHellper.bind();
  };
  private _onLoad = () => {
    this.console.info("success to load image:", this.currentSrc);

    this.status = "success";
    /// 加载成功，结果已经渲染，不需要绑定网络变更
    this._onOnlineHellper.unbind();
  };

  /**网络变动的时候，自动进行重载 */
  private _onOnlineHellper = new EventBindingHelper(this.hostEle, window, "online", () => {
    if (this.status === "error") {
      this.refresh(false);
    }
  });

  /**刷新加载 */
  @Method()
  async refresh(force: boolean = true) {
    const current_src = force && this.src ? this._getCurrentSrc(this.src) : this.currentSrc;
    this._setCurrentSrc(undefined);
    await new Promise<void>(resolve =>
      requestAnimationFrame(async () => {
        this._setCurrentSrc(await current_src);
        resolve();
      }),
    );
  }

  private _initSrc = () => {
    return this.watchSrc(this.src);
  };
  /**监听配置属性变更 */
  private _datasetOb = new MutationObserver(enties => {
    const datasetChanged = enties.some(e => e.type === "attributes" && e.attributeName!.startsWith("data-"));
    if (datasetChanged) {
      void this._initSrc();
    }
  });

  connectedCallback() {
    this._datasetOb.observe(this.hostEle, { attributes: true, attributeOldValue: false });
    void this._initSrc();
  }
  disconnectedCallback() {
    this._onOnlineHellper.unbind();
    this._datasetOb.disconnect();
    this._imgSlotHelper.disconnectedCallback();
  }
  componentDidLoad(): void {
    this._imgSlotHelper.componentDidLoad();
  }

  private _slotEles = createElements<HTMLElement>([]);
  private _imgSlotHelper = new SlotChangeHelper(this.hostEle, "img").onChange(eles => {
    this._slotEles = eles;
    this._setCurrentSrc(this.currentSrc, true);
  });

  render() {
    const width = parseWH(this.width);
    const height = parseWH(this.height);
    const { loading } = this;
    this.console.info("image src:", this.src, "=>", this.currentSrc);
    return (
      <Host>
        <slot name="img">
          <img
            part="img"
            class={"img " + this.status}
            src={this.currentSrc}
            onError={this._onError}
            onLoad={this._onLoad}
            alt={this.alt}
            style={{ width, height }}
            loading={loading}
            cross-origin={this.crossOrigin}
          />
        </slot>
        <div part="error" class={"slotter error" + (this.status === "error" ? " show" : "")}>
          <slot name="error">🖼️{this.alt}</slot>
        </div>
        <div part="success" class={"slotter success" + (this.status === "success" ? " show" : "")}>
          <slot name="success" />
        </div>
        <div part="loading" class={"slotter loading" + (this.status === "loading" ? " show" : "")}>
          <slot name="loading" />
        </div>
      </Host>
    );
  }
}

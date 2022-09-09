import { Component, ComponentInterface, Element, h, Host, Method, Prop, State, Watch } from "@stencil/core";
import { imageProvider } from "../../utils/imageProvider";
import { Logger, manyQuerySelectorAll } from "../../utils/utils";
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

  @Prop({ mutable: true }) proxySrc: string = "";
  private _setTfSrc(proxy_src: string = "") {
    this.proxySrc = proxy_src;
    for (const ele of manyQuerySelectorAll<HTMLImageElement>(this._slotEles, "img")) {
      ele.src = proxy_src;
    }
  }
  @Watch("src")
  async watchSrc(src?: string) {
    return this._setTfSrc(src && (await this._getTfSrc(src)));
  }
  private _getTfSrc(src: string) {
    return imageProvider.transformFromElement(toHref(src), this.hostEle);
  }

  @State() private status: "loading" | "success" | "error" = "loading";
  private _onError = () => {
    this.console.warn("fail to load image:", this.proxySrc);

    this.status = "error";
    /// 网络发生变更的时候，触发重新绑定
    this._onOnlineHellper.bind();
  };
  private _onLoad = () => {
    this.console.info("success to load image:", this.proxySrc);

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
  async refresh(force?: boolean) {
    const proxy_src = force && this.src ? this._getTfSrc(this.src) : this.proxySrc;
    this._setTfSrc(undefined);
    await new Promise<void>(resolve =>
      requestAnimationFrame(async () => {
        this._setTfSrc(await proxy_src);
        this.status = "loading";
        resolve();
      }),
    );
  }

  private _initSrc = async () => {
    await this.watchSrc(this.src);
    this.status = "loading";
  };
  /**监听配置属性变更 */
  private _datasetOb = new MutationObserver(this._initSrc);

  connectedCallback() {
    void this._initSrc();
    this._datasetOb.observe(this.hostEle, { attributes: true, attributeOldValue: false });
  }
  disconnectedCallback() {
    this._onOnlineHellper.unbind();
    this._datasetOb.disconnect();
    this._imgSlotHelper.disconnectedCallback();
  }
  componentDidLoad(): void {
    this._imgSlotHelper.componentDidLoad();
  }

  private _slotEles = new Set<HTMLElement>();
  private _imgSlotHelper = new SlotChangeHelper(this.hostEle, "img").onChange(eles => {
    this._slotEles = eles;
    this._setTfSrc(this.proxySrc);
  });

  render() {
    const width = parseWH(this.width);
    const height = parseWH(this.height);
    const { loading } = this;
    this.console.info("image src:", this.src, "=>", this.proxySrc);
    return (
      <Host>
        <slot name="img">
          <img
            part="img"
            class={"img " + this.status}
            src={this.proxySrc}
            onError={this._onError}
            onLoad={this._onLoad}
            alt={this.alt}
            style={{ width, height }}
            loading={loading}
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

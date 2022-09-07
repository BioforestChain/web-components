import { Component, ComponentInterface, Element, h, Host, Prop, State, Watch } from "@stencil/core";
import { imageProvider } from "../../utils/imageProvider";
import { Logger } from "../../utils/utils";
import { EventBindingHelper } from "../util/eventBinding.helper";

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

  /**
   * 当绑定了 src ，并且 src 加载失败的时候，会转而加载 error-src 来进行替代性渲染
   * 渲染 error-src 的时候，默认会显示alt
   */
  @Prop({ reflect: true }) errorSrc?: string;
  @State() private _errorSrc?: string;
  @Watch("errorSrc")
  private async _watchErrorSrc(errorSrc?: string) {
    this._errorSrc = errorSrc && (await imageProvider.transformFromElement(toHref(errorSrc), this.hostEle));
  }
  @Prop({ reflect: true }) src?: string;
  @State() private _src?: string;
  @Watch("src")
  private async _watchSrc(src?: string) {debugger
    this._src = src && (await imageProvider.transformFromElement(toHref(src), this.hostEle));
  }

  @Prop({ reflect: true }) alt?: string;
  @State() private _showError = false;
  private _onError = () => {
    this.console.warn("fail to load image:", this._src);

    this._showError = true;
    this._isErrorError = false;
    /// 网络发生变更的时候，触发重新绑定
    this._onOnlineHellper.bind();
  };

  private _onOnlineHellper = new EventBindingHelper(this.hostEle, window, "online", () => {
    this._showError = false;
  });

  private _initSrc = async () => {
    await this._watchSrc(this.src);
    await this._watchErrorSrc(this.errorSrc);
    this._showError = false;
  };
  private _datasetOb = new MutationObserver(this._initSrc);

  connectedCallback() {
    void this._initSrc();
    this._datasetOb.observe(this.hostEle, { attributes: true, attributeOldValue: false });
  }
  disconnectedCallback() {
    this._onOnlineHellper.unbind();
    this._datasetOb.disconnect();
  }

  @Prop({ reflect: true }) width?: number;
  @Prop({ reflect: true }) height?: number;
  @Prop({ reflect: true }) loading?: "lazy" | "auto" | "eager";

  @State() private _isErrorError = false;
  private _onErrorError = () => {
    this._isErrorError = true;
  };

  render() {
    const width = parseWH(this.width);
    const height = parseWH(this.height);
    const { loading } = this;
    this.console.info("image src:", this.src, "=>", this._src);
    return (
      <Host>
        {this._showError ? (
          this._isErrorError || !this._errorSrc ? null : (
            <img
              part="error"
              class="error"
              role="error"
              loading={loading}
              src={this._errorSrc}
              alt={this.alt}
              style={{ width, height }}
              onError={this._onErrorError}
            />
          )
        ) : (
          <img
            part="img"
            class="img"
            src={this._src}
            onError={this._onError}
            alt={this.alt}
            style={{ width, height }}
            loading={loading}
          />
        )}
        <blockquote part="alt" class={{ alt: true, show: this._showError }}>
          {this.alt}
        </blockquote>
      </Host>
    );
  }
}

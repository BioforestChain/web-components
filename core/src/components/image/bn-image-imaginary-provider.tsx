import { Component, ComponentInterface, Element, h, Host, Method, Prop, State, Watch } from "@stencil/core";
import { imageProvider } from "../../utils/imageProvider";
import { Logger, nullProtoObj } from "../../utils/utils";
import { ImaginaryTransform } from "./bn-image-imaginary-provider.const";

@Component({
  tag: "bn-image-imaginary-provider",
  styleUrl: "bn-image-imaginary-provider.scss",
  shadow: true,
})
export class BnImageImaginaryProvider implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  /**
   * imaginary 的服务器源
   */
  @Prop({ reflect: true }) readonly origin!: string;
  /**
   * 重定向配置 json 格式
   */
  @Prop({ reflect: true }) readonly redirection?: string;
  @State() private _redirection: { [from: string]: string } = {};
  @Watch("redirection")
  watchRedirection(redirection: string = "{}") {
    try {
      this._redirection = nullProtoObj(JSON.parse(redirection));
    } catch (err) {
      this.console.error(err);
      this._redirection = nullProtoObj({});
    }
    this._transform = undefined;
  }

  private _transform?: ImaginaryTransform;
  private _getTransform() {
    let transform = this._transform;
    const { origin, _redirection: redirection } = this;
    if (transform === undefined || transform.config.origin !== origin || transform.config.redirection !== redirection) {
      transform = new ImaginaryTransform({ origin, redirection });
      this._transform = transform;
    }
    return transform!;
  }

  connectedCallback() {
    this.watchRedirection(this.redirection);
  }
  disconnectedCallback() {
    imageProvider.unregistryTransform(this.hostEle);
  }

  @Method()
  async transform(src: string, params: { [key: string]: unknown }) {
    return this._getTransform().transform(src, params);
  }
  @Method()
  async transformFromElement(src: string, ele: HTMLElement) {
    return this._getTransform().transformFromElement(src, ele);
  }

  render() {
    const transform = this._getTransform();
    imageProvider.registryTransform(this.hostEle, transform);
    return <Host></Host>;
  }
}

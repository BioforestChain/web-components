import { Component, ComponentInterface, Element, h, Host, Method, Prop, State, Watch } from "@stencil/core";
import { Logger, nullProtoObj } from "../../utils/utils";
import { ImaginaryTransform } from "./bn-image-imaginary-adapter.const";
import { $BnImageProvider } from "./bn-image-provider.const";

@Component({
  tag: "bn-image-imaginary-adapter",
  styleUrl: "bn-image-imaginary-adapter.scss",
  shadow: true,
})
export class BnImageImaginaryAdapter implements ComponentInterface, $BnImageProvider.BnImageAdapterBase {
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

  @Method()
  async getTransfrom() {
    return this._getTransform();
  }

  connectedCallback() {
    this.watchRedirection(this.redirection);
  }

  @Prop({}) readonly pixelRatio?: number;

  render() {
    return <Host></Host>;
  }
}

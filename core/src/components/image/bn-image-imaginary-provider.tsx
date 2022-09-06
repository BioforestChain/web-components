import { Component, ComponentInterface, Element, h, Host, Method, Prop } from "@stencil/core";
import { imageProvider } from "../../utils/imageProvider";
import { Logger } from "../../utils/utils";
import { ImaginaryTransform } from "./bn-image-imaginary-provider.const";

@Component({
  tag: "bn-image-imaginary-provider",
  styleUrl: "bn-image-imaginary-provider.scss",
  shadow: true,
})
export class BnImageImaginaryProvider implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  @Prop({ reflect: true }) readonly origin!: string;

  private _transform?: ImaginaryTransform;
  private _getTransform() {
    if (this._transform?.config.origin !== this.origin) {
      this._transform = new ImaginaryTransform({ origin: this.origin });
    }
    return this._transform!;
  }

  connectedCallback() {
    imageProvider.registryTransform(this.hostEle, this._getTransform());
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
    return <Host></Host>;
  }
}

import { Component, ComponentInterface, Element, h, Host, Method, Prop } from "@stencil/core";
import { ImageTransform } from "../../utils/imageProvider.const";
import { Logger } from "../../utils/utils";
import { CustomImageTransform } from "./bn-image-custom-adapter.const";
import { $BnImageProvider } from "./bn-image-provider.const";

@Component({
  tag: "bn-image-custom-adapter",
  styleUrl: "bn-image-custom-adapter.scss",
  shadow: true,
})
export class BnImageCustomAdapter implements ComponentInterface, $BnImageProvider.BnImageAdapterBase {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  private _transform = new CustomImageTransform(this.hostEle);

  @Method()
  async getTransfrom(): Promise<ImageTransform> {
    return this._transform;
  }
  @Prop({})
  pixelRatio?: number | undefined;

  render() {
    return <Host></Host>;
  }
}

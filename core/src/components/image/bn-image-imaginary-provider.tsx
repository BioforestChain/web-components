import { Component, ComponentInterface, Element, h, Host, Prop } from "@stencil/core";
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

  connectedCallback() {
    imageProvider.registryTransform(this.hostEle, new ImaginaryTransform({ origin: this.origin }));
  }
  disconnectedCallback() {
    imageProvider.unregistryTransform(this.hostEle);
  }

  render() {
    return <Host></Host>;
  }
}

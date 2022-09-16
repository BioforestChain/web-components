import { Component, ComponentInterface, Element, h, Host, Method, Event, EventEmitter } from "@stencil/core";
import { imageProvider, ImageTransform } from "../../utils/imageProvider";
import { Logger } from "../../utils/utils";
import { SlotChangeHelper } from "../util/slotChange.helper";
import { $BnImageProvider } from "./bn-image-provider.const";

@Component({
  tag: "bn-image-provider",
  styleUrl: "bn-image-provider.scss",
  shadow: true,
})
export class BnImageProvider implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  @Event()
  readonly adapterChange!: EventEmitter<ImageTransform>;

  private _transform?: ImageTransform;

  private _adapterSlotHelper = new SlotChangeHelper(
    this.hostEle,
    "adapter",
  ).onChange<$BnImageProvider.HTMLBnImageAdapterElement>(async eles => {
    imageProvider.unregistryAllTransform();
    let first = true;
    let _transform: ImageTransform | undefined;
    for (const ele of eles) {
      /// 逆序注册，第一个作为默认项
      if (typeof ele.getTransfrom === "function") {
        const transform = await ele.getTransfrom();
        if (first) {
          this.console.log("registry default image transformer:", ele, transform);
          _transform = transform;
        }
        imageProvider.registryTransform(ele, transform, first);
        first = false;
      }
    }
    if (this._transform !== _transform) {
      this._transform = _transform;
      this.adapterChange.emit(_transform);
    }
  });
  componentDidLoad() {
    this._adapterSlotHelper.componentDidLoad();
  }
  disconnectedCallback() {
    this._adapterSlotHelper.disconnectedCallback();
    /**
     * 这里移除掉，子元素会不会跟着移除掉？
     * 会不会触发SlotChangeHelper？不触发是正确的行为吗？这里不考虑多个 bn-image-provider 的情况
     */
    imageProvider.unregistryAllTransform();
  }

  @Method()
  async transform(src: string, params: { [key: string]: unknown }, config?: { pixelRatio?: number }) {
    const pixelRatio = config?.pixelRatio ?? devicePixelRatio;
    return imageProvider.transform(src, params, { pixelRatio });
  }
  @Method()
  async transformFromElement(src: string, ele: HTMLElement) {
    return imageProvider.transformFromElement(src, ele);
  }

  render() {
    return (
      <Host>
        <slot name="adapter"></slot>
      </Host>
    );
  }
}

import { Component, ComponentInterface, Element, h, Host, Method, Prop, Watch } from "@stencil/core";
import { Logger } from "../../utils/utils";
import { assets } from "../../utils/assets";

@Component({
  tag: "bn-config-util",
  styleUrl: "bn-config-util.scss",
  shadow: true,
})
export class BnConfigUtil implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  connectedCallback() {
    if (assets.root !== assets.parseRoot(this.assetPath, document.baseURI)) {
      this.watchAssetPath();
    }
    this.console.log("assetPath:", assets.root);
  }
  /**
   * 用于 new URL(REL_PATH, assetPath)，所以如果是文件夹，务必要以 '/' 结尾
   */
  @Prop({ reflect: true, mutable: true }) assetPath?: string;
  @Watch("assetPath")
  watchAssetPath() {
    if (this.assetPath) {
      assets.setRoot(assets.parseRoot(this.assetPath, document.baseURI));
    }
  }

  @Method()
  async setAssetPath(path: string) {
    this.assetPath = path;
  }
  @Method()
  async getAssetPath(path = "") {
    return assets.get(path);
  }

  render() {
    return <Host></Host>;
  }
}

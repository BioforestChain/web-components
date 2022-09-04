import {
  Component,
  ComponentInterface,
  Element,
  getAssetPath,
  h,
  Host,
  Method,
  Prop,
  setAssetPath,
  Watch,
} from "@stencil/core";
import { Logger } from "../../utils/utils";

@Component({
  tag: "bn-config-util",
  styleUrl: "bn-config-util.scss",
  shadow: true,
})
export class BnConfigUtil implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  /// 设置默认路径
  static DEFAULT_ASSET_PATH = setAssetPath(new URL("./assets/", location.href).href);
  connectedCallback() {
    if (BnConfigUtil.DEFAULT_ASSET_PATH !== this.assetPath) {
      this.watchAssetPath();
    }
    this.console.log("assetPath:", getAssetPath("./"));
  }
  /**
   * 用于 new URL(REL_PATH, assetPath)，所以如果是文件夹，务必要以 '/' 结尾
   */
  @Prop({ reflect: true, mutable: true }) assetPath?: string;
  @Watch("assetPath")
  watchAssetPath() {
    if (this.assetPath) {
      setAssetPath(new URL(this.assetPath, location.href).href);
    }
  }

  @Method()
  async setAssetPath(path: string) {
    this.assetPath = path;
  }
  @Method()
  async getAssetPath(path = "") {
    return getAssetPath(path);
  }

  render() {
    return <Host></Host>;
  }
}

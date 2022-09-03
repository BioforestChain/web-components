import { Component, ComponentInterface, getAssetPath, h, Host, Method, Prop, setAssetPath, Watch } from "@stencil/core";

@Component({
  tag: "ccc-config-util",
  styleUrl: "ccc-config-util.scss",
  shadow: true,
})
export class CccConfigUtil implements ComponentInterface {
  connectedCallback() {
    if (this._defaultAssetPath !== this.assetPath) {
      this.watchAssetPath();
    }
  }
  private _defaultAssetPath = getAssetPath("./");
  /**
   * click count
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

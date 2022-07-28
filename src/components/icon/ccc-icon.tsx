import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  getAssetPath,
  h,
  Host,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { $Direction, $IconName, IconPaths } from "./ccc-icon.const";

let gloablStyle: HTMLStyleElement | undefined;

@Component({
  tag: "ccc-icon",
  styleUrl: "ccc-icon.scss",
  shadow: true,
  scoped: false,
  assetsDirs: ["./assets"],
})
export class CccIcon implements ComponentInterface {
  constructor() {
    if (!gloablStyle || !gloablStyle.parentElement) {
      gloablStyle = document.createElement("style");
      gloablStyle.innerHTML = `
      @font-face {
        font-family: "ccchain-icon";
        src: url("${getAssetPath("./assets/ccchain.woff")}") format("woff");
        font-weight: normal;
        font-style: normal;
        font-display: block;
      }
      `;
      document.head.appendChild(gloablStyle);
    }
  }
  @Prop({ reflect: true }) name!: $IconName;
  @Event() countChanged!: EventEmitter<number>;
  /**路径的数量 */
  @State() paths = 1;
  @Watch("name")
  watchName() {
    this.paths = IconPaths.get(this.name) ?? 1;
  }
  componentWillLoad() {
    this.watchName();
  }

  @Prop({ reflect: true }) label = "";
  @Prop({ reflect: true }) direction: $Direction = "lr";

  render() {
    return (
      <Host>
        <span class="icon">
          {this.paths > 1 ? Array.from({ length: this.paths }, (_, i) => <span class={`path${i + 1}`}></span>) : null}
        </span>

        <slot name="label">
          <span class="label">{this.label}</span>
        </slot>
      </Host>
    );
  }
}

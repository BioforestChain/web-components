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
import cccIconMetadata from "./assets/cccicon.json";
import type { $Direction } from "./ccc-icon.const";
import type { $CccIconName } from "./ccc-icon.name";

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
      ccc-icon::part(icon) {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: "ccchain-icon" !important;
        speak: never;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;

        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        /*这里和icon-button保持一致的基本风格*/
        font-size: 1.2em;
        width: var(--icon-width, 1.6667em);
        height: var(--icon-height, 1.6667em);
      }
      ccc-icon[thin]::part(icon) {
        font-size: 1em;
        width: var(--icon-width);
        height: var(--icon-height);
      }
      `;
      document.head.appendChild(gloablStyle);
    }
  }
  @Prop({ reflect: true }) name!: $CccIconName;
  @Prop({ reflect: true }) thin = false;
  @Event() countChanged!: EventEmitter<number>;
  /**路径的数量 */
  @State() paths: { char: string; style: any }[] = [];
  @Watch("name")
  watchName() {
    this.paths = cccIconMetadata[this.name] ?? [{ char: this.name }];
  }
  componentWillLoad() {
    this.watchName();
  }

  @Prop({ reflect: true }) label = "";
  @Prop({ reflect: true }) direction: $Direction = "lr";

  render() {
    return (
      <Host>
        <span class="icon" part="icon">
          {this.paths.map(path => (
            <span class="path" style={path.style}>
              {path.char}
            </span>
          ))}
        </span>

        <slot name="label">
          <span class="label">{this.label}</span>
        </slot>
      </Host>
    );
  }
}

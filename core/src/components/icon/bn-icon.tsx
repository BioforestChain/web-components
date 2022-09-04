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
import bnIconMetadata from "./assets/bnqkl-icon.json";
import type { $Direction } from "./bn-icon.const";
import type { $BnIconName } from "./bn-icon.name";

let gloablStyle: HTMLStyleElement | undefined;

@Component({
  tag: "bn-icon",
  styleUrl: "bn-icon.scss",
  shadow: true,
  scoped: false,
  assetsDirs: ["./assets"],
})
export class BnIcon implements ComponentInterface {
  constructor() {
    if (!gloablStyle || !gloablStyle.parentElement) {
      gloablStyle = document.createElement("style");
      gloablStyle.innerHTML = `
      @font-face {
        font-family: "bnqkl-icon";
        src: url("${getAssetPath("./bnqkl-icon.woff")}") format("woff");
        font-weight: normal;
        font-style: normal;
        font-display: block;
      }
      bn-icon::part(icon) {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: "bnqkl-icon" !important;
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
      bn-icon[thin]::part(icon) {
        font-size: 1em;
        width: var(--icon-width);
        height: var(--icon-height);
      }
      `;
      document.head.appendChild(gloablStyle);
    }
  }
  @Prop({ reflect: true }) name!: $BnIconName;
  @Prop({ reflect: true }) thin = false;
  @Event() countChanged!: EventEmitter<number>;
  /**路径的数量 */
  @State() paths: { char: string; style: any }[] = [];
  @Watch("name")
  watchName() {
    this.paths = bnIconMetadata[this.name] ?? [{ char: this.name }];
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

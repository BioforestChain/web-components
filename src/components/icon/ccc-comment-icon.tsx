import { Component, ComponentInterface, h, Host, Prop } from "@stencil/core";
import { $Direction } from "../lottie-web/ccc-lottie-web-toggle-button.const";
import svg from "./assets/ico_interactionbar_comments.svg";

@Component({
  tag: "ccc-comment-icon",
  styleUrl: "ccc-comment-icon.scss",
  shadow: true,
})
export class CccCommentIcon implements ComponentInterface {
  @Prop({ reflect: true }) label = "";
  @Prop({ reflect: true }) direction: $Direction = "lr";

  render() {
    return (
      <Host class={this.direction}>
        <div class="box" innerHTML={svg}></div>
        <slot>
          <span class="label">{this.label}</span>
        </slot>
      </Host>
    );
  }
}

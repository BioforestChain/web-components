import { Component, ComponentInterface, h, Prop, State, Watch } from "@stencil/core";
import { bindThis } from "../../utils/utils";
import { $Direction, toggleButtonRender } from "../lottie-web/ccc-lottie-web-toggle-button.const";
import likeAnimationData from "./assets/like.animation.json";

@Component({
  tag: "ccc-like-button",
  styleUrl: "ccc-like-button.scss",
  shadow: true,
})
export class CccButtonLike implements ComponentInterface {
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) icononly = false;
  @Prop({ mutable: true }) count = 0;
  @Watch("count")
  watchCountHanlder() {
    this.updateCount();
  }
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop() direction: $Direction = "lr";

  @State() count_uncheck = 0;
  @State() count_checked = 0;

  @bindThis
  onChange(event: CustomEvent<boolean>) {
    this.checked = event.detail;
    // this.updateCount();
  }

  connectedCallback() {
    this.updateCount();
  }

  updateCount() {
    if (this.checked) {
      this.count_checked = this.count;
      this.count_uncheck = this.count - 1;
    } else {
      this.count_checked = this.count + 1;
      this.count_uncheck = this.count;
    }
  }

  render() {
    return toggleButtonRender("like-button", likeAnimationData, this, () => (
      <div slot="label" class={`ani-count ${this.direction}`}>
        <span class={{ count: true, top: true, checked: !this.checked }}>
          <slot name="uncheck">{this.count_uncheck}</slot>
        </span>
        <span class={{ count: true, bottom: true, checked: this.checked }}>
          <slot name="checked">{this.count_checked}</slot>
        </span>
      </div>
    ));
  }
}

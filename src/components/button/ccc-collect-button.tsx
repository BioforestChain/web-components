import { Component, ComponentInterface, h, Prop } from "@stencil/core";
import { bindThis } from "../../utils/utils";
import { $Direction, toggleButtonRender } from "../lottie-web/ccc-lottie-web-toggle-button.const";
import collectAnimationData from "./assets/collect.animation.json";

@Component({
  tag: "ccc-collect-button",
  styleUrl: "ccc-collect-button.scss",
  shadow: true,
})
export class CccButtonCollect implements ComponentInterface {
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) icononly = false;
  @Prop() checkLabel: string = "";
  @Prop() unCheckLabel: string = "";

  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop() direction: $Direction = "lr";

  @bindThis
  onChange(event: CustomEvent<boolean>) {
    this.checked = event.detail;
    // this.updateCount();
  }

  render() {
    return toggleButtonRender("collect-button", collectAnimationData, this, () => (
      <div slot="label" class={`ani-count ${this.direction}`}>
        <span class={{ count: true, top: true, checked: this.checked }}>
          <slot name="checked">{this.checkLabel || "已收藏"}</slot>
        </span>
        <span class={{ count: true, bottom: true, checked: !this.checked }}>
          <slot name="uncheck">{this.unCheckLabel || "收藏"}</slot>
        </span>
      </div>
    ));
  }
}

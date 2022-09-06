import { Component, ComponentInterface, Event, EventEmitter, h, Prop } from "@stencil/core";
import { assets } from "../../utils/assets";
import { bindThis } from "../../utils/utils";
import { $ImageToggleButton, imageToggleButtonRender } from "../util/bn-image-toggle-button.const";

@Component({
  tag: "bn-collect-button",
  styleUrl: "bn-collect-button.scss",
  shadow: true,
  assetsDirs: ["./assets"],
})
export class BnButtonCollect implements ComponentInterface {
  @Prop({ reflect: true }) color: $ImageToggleButton.Color = "black";
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) icononly = false;
  @Prop() checkLabel: string = "";
  @Prop() unCheckLabel: string = "";

  @Prop({ mutable: true, reflect: true }) checked = false;
  @Event() checkedChange!: EventEmitter<boolean>;
  @Prop() direction: $ImageToggleButton.Direction = "lr";

  @bindThis
  onChange(event: CustomEvent<boolean>) {
    this.checked = event.detail;
    this.checkedChange.emit(event.detail);
  }

  render() {
    return imageToggleButtonRender(
      {
        src: assets.get("./collect.webp"),
        frames: 48,
        duration: "1.6s",
        checkedColor: `#f7bd25`,
      },
      this,
      () => (
        <div slot="label" class={`ani-count ${this.direction}`}>
          <span class={{ count: true, top: true, checked: this.checked }}>
            <slot name="checked">{this.checkLabel || "已收藏"}</slot>
          </span>
          <span class={{ count: true, bottom: true, checked: !this.checked }}>
            <slot name="uncheck">{this.unCheckLabel || "收藏"}</slot>
          </span>
        </div>
      ),
    );
  }
}

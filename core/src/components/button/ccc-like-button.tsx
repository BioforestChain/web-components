import { Component, ComponentInterface, getAssetPath, h, Prop, State, Watch } from "@stencil/core";
import { bindThis } from "../../utils/utils";
import { $ImageToggleButton, imageToggleButtonRender } from "../util/ccc-image-toggle-button.const";

@Component({
  tag: "ccc-like-button",
  styleUrl: "ccc-like-button.scss",
  shadow: true,
  assetsDirs: ["./assets"],
})
export class CccButtonLike implements ComponentInterface {
  @Prop({ reflect: true }) color: $ImageToggleButton.Color = "black";
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) icononly = false;
  @Prop({ mutable: true }) count = 0;
  @Watch("count")
  watchCountHanlder() {
    this.updateCount();
  }
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop() direction: $ImageToggleButton.Direction = "lr";

  @State() count_uncheck = 0;
  @State() count_checked = 0;

  @bindThis
  onChange(event: CustomEvent<boolean>) {
    this.checked = event.detail;
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
    return imageToggleButtonRender(
      {
        src: getAssetPath("./assets/like.webp"),
        frames: 48,
        duration: "1.6s",
        checkedColor: `#549deb`,
      },
      this,
      () => (
        <div slot="label" class={`ani-count ${this.direction}`}>
          <span class={{ count: true, top: true, checked: !this.checked }}>
            <slot name="uncheck">{this.count_uncheck}</slot>
          </span>
          <span class={{ count: true, bottom: true, checked: this.checked }}>
            <slot name="checked">{this.count_checked}</slot>
          </span>
        </div>
      ),
    );
  }
}

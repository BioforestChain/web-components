import { Component, ComponentInterface, Event, EventEmitter, h, Host, Prop, Watch } from "@stencil/core";
import { bindThis } from "../../utils/utils";
import { $LottieToggleButton } from "./bn-lottie-web-toggle-button.const";

@Component({
  tag: "bn-lottie-web-toggle-button",
  styleUrl: "bn-lottie-web-toggle-button.scss",
  shadow: true,
})
export class BnLottieWebToggleButton implements ComponentInterface {
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) icononly = false;
  @Prop() label = "";
  @Prop({ reflect: true, mutable: true }) labelColor = "";
  @Prop({ reflect: true }) name = "";
  @Prop({ reflect: true }) direction: $LottieToggleButton.Direction = "lr";
  @Prop() animationData: object | undefined = undefined;

  @Prop({ reflect: true, mutable: true }) checked = false;
  @Event() checkedChange!: EventEmitter<boolean>;
  @Watch("checked")
  watchCheckedHanlder() {
    this.checkedChange.emit(this.checked);
  }

  @bindThis
  private toggleChecked() {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
  }

  @bindThis
  onDefaultActivedColorChange(event: CustomEvent<string>) {
    this.labelColor = event.detail;
  }

  render() {
    return (
      <Host>
        <button
          class={`host ${this.direction}`}
          style={{ "--checked-color": this.labelColor }}
          onClick={this.toggleChecked}
        >
          <bn-lottie-web
            class="icon"
            data={this.animationData}
            actived={this.checked}
            onDefaultActivedColorChange={this.onDefaultActivedColorChange}
          ></bn-lottie-web>
          {this.icononly ? null : (
            <slot name="label">
              <span class={{ label: true, checked: this.checked }}>{this.label}</span>
            </slot>
          )}
        </button>
      </Host>
    );
  }
}

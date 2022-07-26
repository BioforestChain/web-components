import { Component, ComponentInterface, Event, EventEmitter, h, Host, Prop, State, Watch } from "@stencil/core";
import { bindThis } from "../../utils/utils";
import { $Direction, forceGetColors } from "./ccc-lottie-web-toggle-button.const";

@Component({
  tag: "ccc-lottie-web-toggle-button",
  styleUrl: "ccc-lottie-web-toggle-button.scss",
  shadow: true,
})
export class CccLottieWebToggleButton implements ComponentInterface {
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) icononly = false;
  @Prop() label = "";
  @Prop({ reflect: true, mutable: true }) labelColor = "";
  @Prop({ reflect: true }) name = "";
  @Prop({ reflect: true }) direction: $Direction = "lr";
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

  @State()
  private colors: ReturnType<typeof forceGetColors> | undefined;
  @Watch("animationData")
  initColors(animationData: object) {
    this.colors = forceGetColors(animationData);
  }
  componentWillLoad() {
    if (this.animationData) {
      this.initColors(this.animationData);
    }
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
          <ccc-lottie-web
            class="icon"
            data={this.animationData}
            actived={this.checked}
            onDefaultActivedColorChange={this.onDefaultActivedColorChange}
          ></ccc-lottie-web>
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

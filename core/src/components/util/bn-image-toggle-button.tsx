import { Component, ComponentInterface, Event, EventEmitter, h, Prop } from "@stencil/core";
import { $ImageToggleButton } from "./bn-image-toggle-button.const";

@Component({
  tag: "bn-image-toggle-button",
  styleUrl: "bn-image-toggle-button.scss",
  shadow: true,
})
export class BnImageToggleButton implements ComponentInterface {
  @Prop() src!: string;
  @Prop() frames!: number;
  @Prop() duration!: string;

  @Prop({ reflect: true }) color: $ImageToggleButton.Color = "black";
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) icononly = false;
  @Prop() label = "";
  @Prop({ reflect: true, mutable: true }) checkedColor = "";
  @Prop({ reflect: true }) direction: $ImageToggleButton.Direction = "lr";

  @Prop({ reflect: true, mutable: true }) checked = false;
  @Event() checkedChange!: EventEmitter<boolean>;

  private _toggleChecked = () => {
    if (this.disabled) {
      return;
    }
    const newValue = !this.checked;
    const event = this.checkedChange.emit(newValue);
    if (event.defaultPrevented === false) {
      this.checked = newValue;
    }
  };

  render() {
    return (
      <button
        class={`host ${this.direction}`}
        style={{ "--checked-color": this.checkedColor }}
        onClick={this._toggleChecked}
      >
        <bn-animation-icon
          part="icon"
          class="icon"
          src={this.src}
          frames={this.frames}
          duration={this.duration}
          actived={this.checked}
        ></bn-animation-icon>
        {this.icononly ? null : (
          <slot name="label">
            <span class={{ label: true, checked: this.checked }}>{this.label}</span>
          </slot>
        )}
      </button>
    );
  }
}

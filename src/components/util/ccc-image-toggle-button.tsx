import { Component, ComponentInterface, Event, EventEmitter, h, Prop, Watch } from "@stencil/core";
import { bindThis } from "../../utils/utils";
import { $Direction, $Color } from "./ccc-image-toggle-button.const";

@Component({
  tag: "ccc-image-toggle-button",
  styleUrl: "ccc-image-toggle-button.scss",
  shadow: true,
})
export class CccImageToggleButton implements ComponentInterface {
  @Prop() src!: string;
  @Prop() frames!: number;
  @Prop() duration!: string;

  @Prop({ reflect: true }) color: $Color = "black";
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) icononly = false;
  @Prop() label = "";
  @Prop({ reflect: true, mutable: true }) checkedColor = "";
  @Prop({ reflect: true }) direction: $Direction = "lr";

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

  render() {
    return (
      <button
        class={`host ${this.direction}`}
        style={{ "--checked-color": this.checkedColor }}
        onClick={this.toggleChecked}
      >
        <ccc-animation-icon
          part="icon"
          class="icon"
          src={this.src}
          frames={this.frames}
          duration={this.duration}
          actived={this.checked}
        ></ccc-animation-icon>
        {this.icononly ? null : (
          <slot name="label">
            <span class={{ label: true, checked: this.checked }}>{this.label}</span>
          </slot>
        )}
      </button>
    );
  }
}

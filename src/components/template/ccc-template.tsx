import { Component, Host, h, Prop, Method, Event, EventEmitter } from "@stencil/core";
import { bindThis } from "../../utils/utils";

@Component({
  tag: "ccc-template",
  styleUrl: "ccc-template.scss",
  shadow: true,
})
export class CccTemplate {
  /**
   * click count
   */
  @Prop() data = 0;
  @Event() countChanged!: EventEmitter<number>;
  /**
   * inc methid
   */
  @Method()
  @bindThis
  async inc() {
    this.data += 1;
    this.countChanged.emit(this.data);
  }
  render() {
    return (
      <Host onClick={this.inc}>
        This is
        <slot></slot>
        <span class="count">
          clicked {this.data} {this.data > 1 ? "times" : "time"}
        </span>
      </Host>
    );
  }
}

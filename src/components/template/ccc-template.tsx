import { Component, ComponentInterface, Element, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core";
import { bindThis, Logger } from "../../utils/utils";

@Component({
  tag: "ccc-template",
  styleUrl: "ccc-template.scss",
  shadow: true,
})
export class CccTemplate implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(() => this.hostEle);

  /**
   * click count
   */
  @Prop({ reflect: true, mutable: true }) count = 0;
  @Event() countChanged!: EventEmitter<number>;
  /**
   * inc methid
   */
  @Method()
  @bindThis
  async inc() {
    this.count += 1;
    this.console.log("inc", this.count);
    this.countChanged.emit(this.count);
  }
  render() {
    return (
      <Host onClick={this.inc}>
        This is
        <slot></slot>
        <span class="count">
          clicked {this.count} {this.count > 1 ? "times" : "time"}
        </span>
      </Host>
    );
  }
}

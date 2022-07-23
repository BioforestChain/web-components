import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { format } from "../../utils/utils";

@Component({
  tag: "my-component",
  styleUrl: "my-component.scss",
  shadow: true,
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  /**
   * name changed!
   */
  @Event()
  named!: EventEmitter<string>;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  render() {
    this.named.emit(this.getText());

    return (
      <div>
        ~~x!!Hello, World! I'm{" "}
        <my-name>
          {this.getText()}
          <slot />
        </my-name>
      </div>
    );
  }
}

import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { format } from "../../utils/utils";

@Component({
  tag: "my-component2",
  styleUrl: "my-component.scss",
  shadow: true,
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() first2: string;

  /**
   * The middle name
   */
  @Prop() middle2: string;

  /**
   * The last name
   */
  @Prop() last2: string;

  /**
   * name changed!
   */
  @Event()
  named2!: EventEmitter<string>;

  private getText(): string {
    return format(this.first2, this.middle2, this.last2);
  }

  render() {
    this.named2.emit(this.getText());

    return (
      <div>
        22222!{" "}
        <my-name>
          <slot />
          {this.getText()}
        </my-name>
      </div>
    );
  }
}

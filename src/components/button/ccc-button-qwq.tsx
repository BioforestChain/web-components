import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "ccc-button-qwq",
  styleUrl: "ccc-button-qwq.scss",
  shadow: true,
})
export class CccButtonQwq {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

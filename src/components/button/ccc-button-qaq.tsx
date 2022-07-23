import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "ccc-button-qaq",
  styleUrl: "ccc-button-qaq.scss",
  shadow: true,
})
export class CccButtonQaq {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

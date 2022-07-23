import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "ccc-template",
  styleUrl: "ccc-template.scss",
  shadow: true,
})
export class CccTemplate {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

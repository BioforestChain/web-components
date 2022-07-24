import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "my-name",
  styleUrl: "my-name.css",
  shadow: true,
})
export class MyName {
  render() {
    return (
      <Host>
        <h1>
          ~~~!!xxxxOh Hi Nxxame:
          <slot></slot>
        </h1>
      </Host>
    );
  }
}

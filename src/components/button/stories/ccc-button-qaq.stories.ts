import { html } from "lit-html";
import { cccButtonQaqKit } from "./autogen";

export default {
  title: "Component/Button/Qaq",
  argTypes: cccButtonQaqKit.argsFactory.toArgTypes(),
};

export const My_Component = cccButtonQaqKit.storyFactory(
  () =>
    html`<!-- push some child element -->
      <h1>qaq</h1>`,
  {
    /* init property/attribute */
    last: "qaq",
  },
);

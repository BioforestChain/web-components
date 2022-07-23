import { html } from "lit-html";
import { cccButtonQwqKit } from "./autogen";

export default {
  title: "Component/Button/Qwq",
  argTypes: cccButtonQwqKit.argsFactory.toArgTypes(),
};

export const My_Component = cccButtonQwqKit.storyFactory(
  () =>
    html`<!-- push some child element -->
      <h1>qaq</h1>`,
  {
    /* init property/attribute */
    last: "qaq",
  },
);

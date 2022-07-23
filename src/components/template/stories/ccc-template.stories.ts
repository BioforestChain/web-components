import { html } from "lit-html";
import { cccTemplateKit } from "./autogen";

export default {
  title: "STORY_TITLE",
  argTypes: cccTemplateKit.argsFactory.toArgTypes(),
};

export const My_Component = cccTemplateKit.storyFactory(
  () =>
    html`<!-- push some child element -->
      <h1>qaq</h1>`,
  {
    /* init property/attribute */
    last: "qaq",
  },
);

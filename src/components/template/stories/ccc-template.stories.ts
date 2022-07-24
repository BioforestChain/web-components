import { html } from "lit-html";
import { cccTemplateKit } from "./autogen";

export default {
  title: "Template/ComponentTitle",
  argTypes: cccTemplateKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccTemplateKit.storyFactory(
  () =>
    // push some child element
    html`<span>template demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

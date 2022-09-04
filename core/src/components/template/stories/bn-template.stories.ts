import { html } from "lit-html";
import { bnTemplateKit } from "./autogen";

export default {
  title: "Template/ComponentTitle",
  argTypes: bnTemplateKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnTemplateKit.storyFactory(
  () =>
    // push some child element
    html`<span>template demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

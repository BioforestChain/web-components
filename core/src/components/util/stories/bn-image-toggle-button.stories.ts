import { html, render } from "lit-html";
import { bnImageToggleButtonKit } from "./autogen";

export default {
  title: "Component/Button/Image Toggle Button",
  argTypes: bnImageToggleButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnImageToggleButtonKit.storyFactory(
  () =>
    // push some child element
    html``,
  {
    // init property/attribute
    // data: 0,
  },
);

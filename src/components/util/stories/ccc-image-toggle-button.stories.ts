import { html, render } from "lit-html";
import { cccImageToggleButtonKit } from "./autogen";

export default {
  title: "Component/Button/Image Toggle Button",
  argTypes: cccImageToggleButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccImageToggleButtonKit.storyFactory(
  () =>
    // push some child element
    html``,
  {
    // init property/attribute
    // data: 0,
  },
);

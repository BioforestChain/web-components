import { html } from "lit-html";
import { cccSliderKit } from "./autogen";

export default {
  title: "Component/Slider/Slider",
  argTypes: cccSliderKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccSliderKit.storyFactory(
  () =>
    // push some child element
    html`<span>slider demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

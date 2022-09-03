import { html } from "lit-html";
import { cccSliderScrollbarKit } from "./autogen";

export default {
  title: "Component/Slider/Slider Scrollbar",
  argTypes: cccSliderScrollbarKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccSliderScrollbarKit.storyFactory(
  () =>
    // push some child element
    html`<span>slider-scrollbar demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

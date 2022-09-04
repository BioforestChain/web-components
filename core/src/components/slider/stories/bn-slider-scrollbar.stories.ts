import { html } from "lit-html";
import { bnSliderScrollbarKit } from "./autogen";

export default {
  title: "Component/Slider/Slider Scrollbar",
  argTypes: bnSliderScrollbarKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnSliderScrollbarKit.storyFactory(
  () =>
    // push some child element
    html`<span>slider-scrollbar demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

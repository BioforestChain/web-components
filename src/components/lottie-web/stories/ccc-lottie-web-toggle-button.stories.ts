import { html } from "lit-html";
import { cccLottieWebToggleButtonKit } from "./autogen";

export default {
  title: "Component/Lottie Web/Toggle Button",
  argTypes: cccLottieWebToggleButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccLottieWebToggleButtonKit.storyFactory(
  () =>
    // push some child element
    html`<span>lottie-web-toggle-button demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

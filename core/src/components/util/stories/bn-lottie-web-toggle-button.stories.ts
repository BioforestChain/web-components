import { html } from "lit-html";
import { bnLottieWebToggleButtonKit } from "./autogen";

export default {
  title: "Component/Lottie Web/Toggle Button",
  argTypes: bnLottieWebToggleButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnLottieWebToggleButtonKit.storyFactory(
  () =>
    // push some child element
    html`<span>lottie-web-toggle-button demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

import { html } from "lit-html";
import { cccLottieWebKit } from "./autogen";

export default {
  title: "Component/Lottie Web",
  argTypes: cccLottieWebKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccLottieWebKit.storyFactory(
  () =>
    // push some child element
    html`<span>lottie-web demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

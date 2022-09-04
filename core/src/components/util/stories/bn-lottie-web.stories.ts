import { html } from "lit-html";
import { bnLottieWebKit } from "./autogen";

export default {
  title: "Component/Lottie Web",
  argTypes: bnLottieWebKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnLottieWebKit.storyFactory(
  () =>
    // push some child element
    html`<span>lottie-web demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

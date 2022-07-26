import { html } from "lit-html";
import { cccLikeButtonKit } from "./autogen";

export default {
  title: "Component/Button/Like",
  argTypes: cccLikeButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccLikeButtonKit.storyFactory(
  () =>
    // push some child element
    html`<span>like-button demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

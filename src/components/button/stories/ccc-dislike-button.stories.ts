import { html } from "lit-html";
import { cccDislikeButtonKit } from "./autogen";

export default {
  title: "Component/Button/Dislike",
  argTypes: cccDislikeButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccDislikeButtonKit.storyFactory(
  () =>
    // push some child element
    html`<span>dislike-button demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

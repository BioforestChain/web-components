import { html } from "lit-html";
import { bnDislikeButtonKit } from "./autogen";
import { themeStyle } from "./theme-helper";

export default {
  title: "Component/Button/Dislike",
  argTypes: bnDislikeButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnDislikeButtonKit
  .storyFactory(
    () =>
      // push some child element
      html`<span>dislike-button demo</span>`,
    {
      // init property/attribute
      // data: 0,
    },
  )
  .addStyle(themeStyle);

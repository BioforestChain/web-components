import { html } from "lit-html";
import { bnLikeButtonKit } from "./autogen";
import { themeStyle } from "./theme-helper";

export default {
  title: "Component/Button/Like",
  argTypes: bnLikeButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnLikeButtonKit
  .storyFactory(
    () =>
      // push some child element
      html`<span>like-button demo</span>`,
    {
      // init property/attribute
      // data: 0,
    },
  )
  .addStyle(themeStyle);

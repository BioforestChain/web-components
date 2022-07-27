import { html, render } from "lit-html";
import { cccLikeButtonKit } from "./autogen";
import { insertThemeColorOnMount } from "./theme-helper";

export default {
  title: "Component/Button/Like",
  argTypes: cccLikeButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccLikeButtonKit
  .storyFactory(
    () =>
      // push some child element
      html`<span>like-button demo</span>`,
    {
      // init property/attribute
      // data: 0,
    },
  )
  .onMount(insertThemeColorOnMount);

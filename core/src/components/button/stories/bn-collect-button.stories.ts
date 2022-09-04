import { html } from "lit-html";
import { bnCollectButtonKit } from "./autogen";
import { themeStyle } from "./theme-helper";

export default {
  title: "Component/Button/Collect",
  argTypes: bnCollectButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnCollectButtonKit
  .storyFactory(
    () =>
      // push some child element
      html`<span>collect-button demo</span>`,
    {
      // init property/attribute
      // data: 0,
    },
  )
  .addStyle(themeStyle);

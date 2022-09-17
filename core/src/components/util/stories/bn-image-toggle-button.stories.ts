import { html, render } from "lit-html";
import { bnImageToggleButtonKit } from "./autogen";

export default {
  title: "Component/Button/Image Toggle Button",
  argTypes: bnImageToggleButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnImageToggleButtonKit.storyFactory(() => html``, {});

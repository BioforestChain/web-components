import { html } from "lit-html";
import { cccCollectButtonKit } from "./autogen";

export default {
  title: "Component/Button/Collect",
  argTypes: cccCollectButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccCollectButtonKit.storyFactory(
  () =>
    // push some child element
    html`<span>collect-button demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

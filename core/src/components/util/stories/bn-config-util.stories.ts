import { html } from "lit-html";
import { bnConfigUtilKit } from "./autogen";

export default {
  title: "Component/Util/Config",
  argTypes: bnConfigUtilKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnConfigUtilKit.storyFactory(
  () =>
    // push some child element
    html`<span>config-util demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

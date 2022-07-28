import { html } from "lit-html";
import { cccConfigUtilKit } from "./autogen";

export default {
  title: "Component/Util/Config",
  argTypes: cccConfigUtilKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccConfigUtilKit.storyFactory(
  () =>
    // push some child element
    html`<span>config-util demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

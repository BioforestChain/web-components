import { html } from "lit-html";
import { cccHasMoreTextKit } from "./autogen";

export default {
  title: "Component/Text/Has More",
  argTypes: cccHasMoreTextKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccHasMoreTextKit.storyFactory(
  () =>
    // push some child element
    html``,
  {
    // init property/attribute
    text: "你好你好".repeat(100),
  },
).addStyle(`
ccc-has-more-text::part(text){
  color: #673ab7;
}
`);

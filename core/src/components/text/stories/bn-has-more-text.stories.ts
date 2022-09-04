import { html } from "lit-html";
import { bnHasMoreTextKit } from "./autogen";

export default {
  title: "Component/Text/Has More",
  argTypes: bnHasMoreTextKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnHasMoreTextKit.storyFactory(
  () =>
    // push some child element
    html``,
  {
    // init property/attribute
    text: "你好你好".repeat(100),
  },
).addStyle(`
bn-has-more-text::part(text){
  color: #673ab7;
}
`);

import { html } from "lit-html";
import { cccCommentIconKit } from "./autogen";

export default {
  title: "Component/Icon/Comment",
  argTypes: cccCommentIconKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccCommentIconKit.storyFactory(
  () =>
    // push some child element
    html`<span>comment-icon demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

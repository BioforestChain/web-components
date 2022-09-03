import { html } from "lit-html";
import { cccReplyCommentButtonKit } from "./autogen";

export default {
  title: "Component/Button/Reply Comment",
  argTypes: cccReplyCommentButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccReplyCommentButtonKit.storyFactory(
  () =>
    // push some child element
    html`<span>reply-comment-button demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

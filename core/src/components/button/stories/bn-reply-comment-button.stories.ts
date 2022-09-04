import { html } from "lit-html";
import { bnReplyCommentButtonKit } from "./autogen";

export default {
  title: "Component/Button/Reply Comment",
  argTypes: bnReplyCommentButtonKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnReplyCommentButtonKit.storyFactory(
  () =>
    // push some child element
    html`<span>reply-comment-button demo</span>`,
  {
    // init property/attribute
    // data: 0,
  },
);

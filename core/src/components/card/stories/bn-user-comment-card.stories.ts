import { html } from "lit-html";
import { bnUserCommentCardKit } from "./autogen";

export default {
  title: "Component/Card/User Comment",
  argTypes: bnUserCommentCardKit.argsFactory.toArgTypes(),
};

const baseArgs: typeof bnUserCommentCardKit.$Args = {
  // init property/attribute
  userAvator: "./assets/flower.png",
  userName: "Gaubee",
  userFlag: "作者",
  time: "3分钟前",
  text: "这是一些评论",
  lineClamp: 4,
};

export const Base_Usage = bnUserCommentCardKit.storyFactory(() => html``, baseArgs);
export const Long_Text = bnUserCommentCardKit.storyFactory(() => html``, {
  ...baseArgs,
  text: "这是一些很长的评论 ".repeat(20),
});

export const Custom_Actions = bnUserCommentCardKit.storyFactory(
  () => html`
    <bn-like-button slot="actions"></bn-like-button>
    <bn-dislike-button slot="actions"></bn-dislike-button>
  `,
  baseArgs,
);

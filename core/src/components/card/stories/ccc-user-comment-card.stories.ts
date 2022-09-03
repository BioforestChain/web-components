import { html } from "lit-html";
import { cccUserCommentCardKit } from "./autogen";

export default {
  title: "Component/Card/User Comment",
  argTypes: cccUserCommentCardKit.argsFactory.toArgTypes(),
};

const baseArgs: typeof cccUserCommentCardKit.$Args = {
  // init property/attribute
  userAvator: "./assets/flower.png",
  userName: "Gaubee",
  userFlag: "作者",
  time: "3分钟前",
  text: "这是一些评论",
  lineClamp: 4,
};

export const Base_Usage = cccUserCommentCardKit.storyFactory(() => html``, baseArgs);
export const Long_Text = cccUserCommentCardKit.storyFactory(() => html``, {
  ...baseArgs,
  text: "这是一些很长的评论 ".repeat(20),
});

export const Custom_Actions = cccUserCommentCardKit.storyFactory(
  () => html`
    <ccc-like-button slot="actions"></ccc-like-button>
    <ccc-dislike-button slot="actions"></ccc-dislike-button>
  `,
  baseArgs,
);

import { html } from "lit-html";
import { bnImageKit } from "./autogen";

export default {
  title: "Component/Image",
  argTypes: bnImageKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnImageKit.storyFactory(
  () =>
    // push some child element
    html`<span>image demo</span>`,
  {
    src: "https://localhost:6006/assets/logo.webp",
  },
);

export const When_Error = bnImageKit.storyFactory(
  () =>
    // push some child element
    html`<span>image demo</span>`,
  {
    src: "https://localhost:6006/assets/error.jpg",
    errorSrc: "https://localhost:6006/assets/skybox.jpg",
    alt: "错误图片",
  },
);

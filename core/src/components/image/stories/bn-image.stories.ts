import { html } from "lit-html";
import { bnImageKit } from "./autogen";

export default {
  title: "Component/Image",
  argTypes: bnImageKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnImageKit.storyFactory(
  () =>
    // push some child element
    html`<span></span>`,
  {
    src: "https://localhost:6006/assets/flower.png",
    alt: "花朵图片",
  },
);

export const When_Error = bnImageKit.storyFactory(
  () =>
    // push some child element
    html`<span slot="error">图片没下载下来~</span>`,
  {
    src: "https://localhost:6006/assets/error.jpg",
    alt: "错误图片",
  },
);

export const When_Success = bnImageKit.storyFactory(
  () =>
    // push some child element
    html`<span slot="success">加载成功~</span>`,
  {
    src: "https://localhost:6006/assets/flower.png",
    alt: "花朵图片",
  },
);

export const When_Loading = bnImageKit.storyFactory(
  () =>
    // push some child element
    html` <span slot="loading">加载中……</span>
      <span slot="success">打开Devtools，使用 Network 面板中的 throttling 控制网络</span>`,
  {
    src: "https://localhost:6006/assets/flower.png",
    alt: "花朵图片",
  },
);

export const CustomImage = bnImageKit.storyFactory(
  () =>
    // push some child element
    html`
      <div slot="img">
        <p>这是自定义图片,src与alt会自动被绑定:</p>
        <img />
      </div>
    `,
  {
    src: "https://localhost:6006/assets/flower.png",
    alt: "花朵图片",
  },
);

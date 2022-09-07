import { html } from "lit-html";
import { bnPictureModelViewerKit } from "./autogen";

export default {
  title: "Component/Model/Picture Model Viewer",
  argTypes: bnPictureModelViewerKit.argsFactory.toArgTypes(),
};

const VIEWER_STYLE = `
  bn-picture-model-viewer {
    width: 80vmin;
    height: 80vmin;
  }
`;

export const Base_Usage = bnPictureModelViewerKit
  .storyFactory(
    () =>
      // push some child element
      html``,
    {
      src: "https://localhost:6006/assets/flower.png",
    },
  )
  .addStyle(VIEWER_STYLE);

export const With_SkyboxImage = bnPictureModelViewerKit
  .storyFactory(
    () =>
      // push some child element
      html``,
    {
      src: "https://localhost:6006/assets/flower.png",
      skyboxImage: "https://localhost:6006/assets/skybox.jpg",
    },
  )
  .addStyle(VIEWER_STYLE);

export const Custom_Poster = bnPictureModelViewerKit
  .storyFactory(
    () =>
      // push some child element
      html`<span slot="poster">picture-model-viewer demo</span>`,
    {
      src: "https://localhost:6006/assets/flower.png",
    },
  )
  .addStyle(VIEWER_STYLE);

import { html } from "lit-html";
import { bnPictureModelViewerKit } from "./autogen";

export default {
  title: "Component/Model/Picture Model Viewer",
  argTypes: bnPictureModelViewerKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnPictureModelViewerKit.storyFactory(
  () =>
    // push some child element
    html`<span>picture-model-viewer demo</span>`,
  {
    src: "https://localhost:6006/assets/logo.webp",
    skyboxImage: "https://localhost:6006/assets/skybox.jpg",
  },
).addStyle(`
bn-picture-model-viewer {
  width: 80vmin;
  height: 80vmin;
}
`);

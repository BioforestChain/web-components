import { html } from "lit-html";
import { cccPictureModelViewerKit } from "./autogen";

export default {
  title: "Component/Model/Picture Model Viewer",
  argTypes: cccPictureModelViewerKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccPictureModelViewerKit.storyFactory(
  () =>
    // push some child element
    html`<span>picture-model-viewer demo</span>`,
  {
    src: "https://localhost:6006/assets/logo.png",
    skyboxImage: "https://localhost:6006/assets/skybox.jpg",
  },
).addStyle(`
ccc-picture-model-viewer {
  width: 200px;
  height: 200px;
}
`);

import { html } from "lit-html";
import { querySelector } from "../../../utils/utils";
import { bnBlurGroundImageKit } from "./autogen";

export default {
  title: "Component/Image/Blur Background",
  argTypes: bnBlurGroundImageKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnBlurGroundImageKit
  .storyFactory(
    () =>
      // push some child element
      html`<img slot="img" src="/assets/demo-texture.jpg" />`,
    {},
  )
  .addHtmlTpl(
    html`
      <hr />
      <label>
        Width:
        <input id="img-width" type="range" min="10" value="100" max="500" step="1" />
      </label>
      <label>
        Height:
        <input id="img-height" type="range" min="10" value="100" max="500" step="1" />
      </label>
    `,
  )
  .addStyle(
    `
  bn-blur-ground-image {
    outline: 1px solid rgba(255,0,0,0.5);
  }
`,
  )
  .onMount((frag, imgEle) => {
    const imgWidthCtrl = querySelector<HTMLInputElement>(frag, "#img-width")!;
    {
      const onWidthChange = () => {
        imgEle.style.width = imgWidthCtrl.value + "px";
      };
      onWidthChange();
      imgWidthCtrl.oninput = onWidthChange;
    }
    const imgHeightCtrl = querySelector<HTMLInputElement>(frag, "#img-height")!;
    {
      const onHeightChange = () => {
        imgEle.style.height = imgHeightCtrl.value + "px";
      };
      onHeightChange();
      imgHeightCtrl.oninput = onHeightChange;
    }
  });

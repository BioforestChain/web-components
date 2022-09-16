import { html } from "lit-html";
import { querySelector } from "../../../utils/utils";
import { bnImageProviderKit } from "./autogen";

export default {
  title: "Component/Image/Image Provider",
  argTypes: bnImageProviderKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnImageProviderKit
  .storyFactory(
    () => html`
      <bn-image-custom-adapter id="adapter-1"></bn-image-custom-adapter>
      <bn-image-imaginary-adapter id="adapter-2"></bn-image-imaginary-adapter>
      <bn-image-custom-adapter id="adapter-3"></bn-image-custom-adapter>
    `,
    {},
  )
  .addHtmlTpl(
    html`
      <fieldset>
        <legend>切换适配器</legend>
        <label>
          <input id="adapter-1-toggle" type="checkbox" />
          ：custom-adapter
        </label>
        <label>
          <input id="adapter-2-toggle" type="checkbox" />
          ：imaginary-adapter
        </label>
        <label>
          <input id="adapter-3-toggle" type="checkbox" />
          ：custom-adapter
        </label>
      </fieldset>
      <p>始终会将第一个adapter作为默认适配器</p>
    `,
  )
  .addStyle(
    `
  bn-image-provider {
    display: flex;
    background: #00bcd4;
    height: 120px;
    gap: 10px;
    padding: 10px 10px;
    box-sizing: border-box;
  }
  bn-image-provider > *{
    display: inline-block;
    width: 100px;
    height: 100px;
    background: red;
  }
  label{
    display: block;
  }`,
  )
  .onMount(flag => {
    for (let i = 1; i <= 3; i++) {
      const adapterEle = querySelector<HTMLBnImageCustomAdapterElement>(flag, `#adapter-${i}`)!;
      const adapterToggleEle = querySelector<HTMLInputElement>(flag, `#adapter-${i}-toggle`)!;
      adapterToggleEle.addEventListener("change", () => {
        adapterEle.slot = adapterToggleEle.checked ? "adapter" : "";
      });
    }
  });

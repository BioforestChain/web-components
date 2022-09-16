import { html } from "lit-html";
import { querySelector } from "../../../utils/utils";
import { bnImageCustomAdapterKit } from "./autogen";
import { $BnImageCustomAdapter } from "../bn-image-custom-adapter.const";

export default {
  title: "Component/Image/Image Custom Adapter",
  argTypes: bnImageCustomAdapterKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnImageCustomAdapterKit
  .storyFactory(
    () =>
      // push some child element
      html``,
    {
      // init property/attribute
      // data: 0,
    },
  )
  .addHtmlTpl(
    html` <bn-image-provider id="provider"></bn-image-provider>
      <label>
        Input Src:
        <input id="input-url" disabled value="https://gaubee.com" />
      </label>
      <label>
        Output Src:
        <input id="output-url" disabled />
      </label>`,
  )
  .addStyle(
    `
  label {
    display: block;
    margin: 0.5em 0;
  }
  `,
  )
  .onMount((flag, ele) => {
    ele.slot = "adapter";
    const inputUrlEle = querySelector<HTMLInputElement>(flag, "#input-url")!;
    const outputUrlEle = querySelector<HTMLInputElement>(flag, "#output-url")!;
    const doTransform = async () => {
      outputUrlEle.value = await providerEle.transformFromElement(inputUrlEle.value, inputUrlEle);
    };
    inputUrlEle.oninput = doTransform;

    (ele as $BnImageCustomAdapter.HTMLBnImageCustomAdapterElement).addEventListener("transform", event => {
      event.detail.promise((cb, url) => {
        const u = new URL(url, location.href);
        u.hash = "OKK";
        cb(null, u.href);
      });
    });

    const providerEle = querySelector<HTMLBnImageProviderElement>(flag, "#provider")!;
    providerEle.append(ele);
    providerEle.addEventListener("adapterChange", () => {
      inputUrlEle.disabled = false;
      doTransform();
    });
  });

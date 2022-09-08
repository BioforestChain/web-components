import { html } from "lit-html";
import { bnImageImaginaryProviderKit } from "./autogen";

export default {
  title: "Component/Image/Image Imaginary Provider",
  argTypes: bnImageImaginaryProviderKit.argsFactory.toArgTypes(),
};

const GEN_IMG_NUM_INPUT = (id: string, label: string, value = 0, min = 0, max = 500, step = 10) => {
  return html` <label for="${id}">
    ${label}:
    <input id="${id}" type="number" step="${step}" value="${value}" min="${min}" max="${max}" />
  </label>`;
};

const CTRL_HTML = html`
  <blockquote>你需要配置自己的 imaginary 服务器到 origin 中才能进行测试</blockquote>
  <section>
    <h3>Set Test Image</h3>
    <input id="input-image" value="https://avatars.githubusercontent.com/u/2151644" />
  </section>
`;
const CTRL_STYLE = `
blockquote {
  color: rgba(0,0,0, 0.5);
  border-left: 1em solid rgb(30 167 253 / 68%);
  margin-left: 0;
  padding-left: 1em;
  background: linear-gradient(45deg, rgb(30 167 253 / 16%), transparent);
}
section {
  background: #eee;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  margin-bottom: 1em;
}
`;
const CTRL_JS = (frag: DocumentFragment) => {
  const bnimgs = frag.querySelectorAll("bn-image");
  const bnImageForeach = (callback: (ele: HTMLBnImageElement) => unknown) => {
    for (const ele of bnimgs) {
      callback(ele);
    }
  };
  const debounce = <T extends Function>(fn: T, ms: number) => {
    let ti: any;
    return (...args) => {
      ti && clearTimeout(ti);
      ti = setTimeout(() => {
        ti = undefined;
        fn(...args);
      }, ms);
    };
  };

  const numberInput = (id: string, bind: (ele: HTMLBnImageElement, value: string) => void) => {
    const inputImageEle = frag.querySelector<HTMLInputElement>("#" + id);
    if (!inputImageEle) {
      return;
    }
    const bindValue = () => {
      bnImageForeach(ele => bind(ele, inputImageEle.value));
    };
    inputImageEle.onchange = bindValue;
    bindValue();
  };
  //src
  numberInput("input-image", (ele, val) => (ele.src = val));
  // width
  numberInput("img-width-input", (ele, val) => (ele.width = +val || undefined));
  // height
  numberInput("img-height-input", (ele, val) => (ele.height = +val || undefined));

  numberInput("img-areawidth-input", (ele, val) => (ele.dataset.areawidth = +val ? val : undefined));
  numberInput("img-areaheight-input", (ele, val) => (ele.dataset.areaheight = +val ? val : undefined));
};
const CtrlTpl = bnImageImaginaryProviderKit
  .storyFactory(() => html``, {
    origin: "https://172.30.90.240:9000/",
  })
  .addHtmlTpl(CTRL_HTML)
  .addStyle(CTRL_STYLE)
  .onMount(CTRL_JS);

const WIDTH_HEIGHT_CTRL = html`
  ${GEN_IMG_NUM_INPUT("img-width-input", "Width", 100)}
  <br />
  ${GEN_IMG_NUM_INPUT("img-height-input", "Height", 0)}
  <br />
`;

export const Resize = CtrlTpl.clone().addHtmlTpl(html` <section>
  <h3>Resize Image</h3>
  ${WIDTH_HEIGHT_CTRL}
  <bn-image id="img" data-mode="resize" data-width="auto"></bn-image>
</section>`);

export const Crop = CtrlTpl.clone().addHtmlTpl(html` <section>
  <h3>Crop Image</h3>
  ${WIDTH_HEIGHT_CTRL}
  <bn-image id="img" data-mode="smartcrop" data-width="auto" data-height="auto"></bn-image>
</section>`);

export const SmartCrop = CtrlTpl.clone().addHtmlTpl(html` <section>
  <h3>SmartCrop Image</h3>
  ${WIDTH_HEIGHT_CTRL}
  <bn-image id="img" data-mode="smartcrop" data-width="auto" data-height="auto"></bn-image>
</section>`);

export const Extract = CtrlTpl.clone().addHtmlTpl(html` <section>
  <h3>Extract Image</h3>
  ${GEN_IMG_NUM_INPUT("img-areawidth-input", "Area Width", 300)}
  <br />
  ${GEN_IMG_NUM_INPUT("img-areaheight-input", "Area Height", 300)}
  <br />
  <bn-image id="img" data-mode="extract"></bn-image>
</section>`);

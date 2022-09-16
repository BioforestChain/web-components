import { html } from "lit-html";
import { querySelector } from "../../../utils/utils";
import { bnImageImaginaryAdapterKit } from "./autogen";

export default {
  title: "Component/Image/Image Imaginary Adapter",
  argTypes: bnImageImaginaryAdapterKit.argsFactory.toArgTypes(),
};

const GEN_IMG_NUM_INPUT = (id: string, label: string, value = 0, min = 0, max = 500, step = 10) => {
  return html` <label for="${id}">
    ${label}:
    <input id="${id}" type="range" step="${1}" value="${value}" min="${min}" max="${max}" />
  </label>`;
};

const enum ImaginaryService {
  REMOTE = "remote",
  LOCALE = "locale",
}
const ImaginaryServiceCtrl = {
  get() {
    let val = localStorage.getItem("imaginary-service") as ImaginaryService | null;
    if (val === null) {
      val = ImaginaryService.REMOTE;
      localStorage.setItem("imaginary-service", val);
    }
    return val;
  },
  set(v: ImaginaryService) {
    localStorage.setItem("imaginary-service", v);
  },
};

const CTRL_INPUT_IMAGE = {
  [ImaginaryService.LOCALE]: "https://avatars.githubusercontent.com/u/2151644",
  [ImaginaryService.REMOTE]:
    "https://storage-qacarbonstorage.p.googleapis.com/qa-carbon/qa-carbon/2auIo33K/09ab7f9a48ab067cebaff8f08c3b69eb.jpeg",
};
const CTRL_HTML = html`
  <blockquote>你需要配置自己的 imaginary 服务器到 origin 中才能进行测试</blockquote>
  <section>
    <h3>Set Test Image</h3>
    <!-- <input id="input-image" value="https://avatars.githubusercontent.com/u/2151644" /> -->
    <label>
      图像链接：
      <input id="input-image" type="url" value="${CTRL_INPUT_IMAGE[ImaginaryServiceCtrl.get()]}" />
    </label>
    <label>
      切换开关：
      <label>
        <input name="imaginary-service" value="${ImaginaryService.LOCALE}" type="radio" />
        ：使用本地服务（需要自己部署imaginary服务）
      </label>
      <label>
        <input name="imaginary-service" value="${ImaginaryService.REMOTE}" type="radio" />
        ：使用远程服务
      </label>
    </label>
  </section>
`;
const CTRL_ORIGIN = {
  [ImaginaryService.LOCALE]: `https://172.30.90.240:9000/`,
  [ImaginaryService.REMOTE]: `https://qaimg.tansocc.com/`,
};

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
    // inputImageEle.onchange = bindValue;
    inputImageEle.oninput = bindValue;
    bindValue();
  };
  {
    const curValue = ImaginaryServiceCtrl.get();
    for (const ele of frag.querySelectorAll<HTMLInputElement>(`[name='imaginary-service']`)) {
      ele.checked = ele.value === curValue;
      ele.onchange = () => {
        if (ele.checked) {
          ImaginaryServiceCtrl.set(ele.value as ImaginaryService);
          location.reload();
        }
      };
    }
  }
  //src
  numberInput("input-image", (ele, val) => (ele.src = val));
  // width
  numberInput("img-width-input", (ele, val) => (ele.width = +val || undefined));
  // height
  numberInput("img-height-input", (ele, val) => (ele.height = +val || undefined));

  numberInput("img-areawidth-input", (ele, val) => (ele.dataset.areawidth = +val ? val : undefined));
  numberInput("img-areaheight-input", (ele, val) => (ele.dataset.areaheight = +val ? val : undefined));
};

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
label {
  display: block;
}
input[type="url"] {
  width: 100%;
}
`;

const CtrlTpl = bnImageImaginaryAdapterKit
  .storyFactory(() => html``, {
    origin: CTRL_ORIGIN[ImaginaryServiceCtrl.get()],
  })
  .addHtmlTpl(html`<bn-image-provider id="provider"></bn-image-provider>`)
  .onMount((flag, ele) => {
    ele.slot = "adapter";
    const providerEle = querySelector(flag, "#provider")!;
    providerEle.append(ele);
    const imgEle = querySelector<HTMLBnImageElement>(flag, "#img")!;
    providerEle.addEventListener("adapterChange", () => {
      imgEle.refresh();
    });
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

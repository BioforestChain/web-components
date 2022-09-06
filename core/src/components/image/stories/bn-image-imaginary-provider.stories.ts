import { html } from "lit-html";
import { bnImageImaginaryProviderKit } from "./autogen";

export default {
  title: "Component/Image/Image Imaginary Provider",
  argTypes: bnImageImaginaryProviderKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnImageImaginaryProviderKit
  .storyFactory(
    () =>
      // push some child element
      html`<span>image-imaginary-provider demo</span>`,
    {
      // init property/attribute
      // data: 0,
      origin: "https://172.30.90.240:9000/",
    },
  )
  .addHtmlTpl(
    html`
      <blockquote>你需要配置自己的 imaginary 服务器到 origin 中才能进行测试</blockquote>
      <hr />
      <section>
        <h3>Resize Image (Gaubee Github Avatar)</h3>
        <label for="img-size-input"> </label>
        <input id="img-size-input" type="range" min="10" max="500" />
        <br />
        <bn-image
          id="img"
          src="https://avatars.githubusercontent.com/u/2151644"
          data-mode="resize"
          data-width="100"
        ></bn-image>
      </section>
    `,
  )
  .onMount(frag => {
    const imgSizeLabelEle = frag.querySelector<HTMLInputElement>(`[for="img-size-input"]`)!;
    const imgSizeInputEle = frag.querySelector<HTMLInputElement>("#img-size-input")!;
    const imgEle = frag.querySelector<HTMLBnImageElement>("#img")!;
    imgSizeInputEle.value = imgEle.dataset.width!;
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
    const bindSize = debounce(() => {
      imgSizeLabelEle.innerHTML = imgSizeInputEle.value;
      imgEle.dataset.width = imgSizeInputEle.value;
    }, 200);
    bindSize();
    imgSizeInputEle.oninput = bindSize;
  });

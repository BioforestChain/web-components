import { html, TemplateResult } from "lit-html";
import { bnSliderKit } from "./autogen";

export default {
  title: "Component/Slider/Slider",
  argTypes: bnSliderKit.argsFactory.toArgTypes(),
};

const DEMO_HTML = html`<div slot="slider" class="slider item-1">
    <h2>slider 1</h2>
  </div>
  <div slot="slider" class="slider item-2">
    <h2>slider 2</h2>
    <ol>
      ${Array.from({ length: 40 }, (_, i) => html`<li>~${i}~${i}~${i}~${i}~${i}~${i}~${i}~${i}~${i}~</li>`)}
    </ol>
  </div>
  <div slot="slider" class="slider item-3">
    <h2>slider 3</h2>
  </div>`;
const DEMO_STYLE = `
  bn-slider{
    width: 300px;
    height: 500px;
  }
  .slider {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: auto;
  }
  .item-1{
    background: #e91e6388;
  }
  .item-2{
    background: #4caf5088;
    justify-content: flex-start;
  }
  .item-3{
    background: #2196f388;
  }
  `;

export const Base_Usage = bnSliderKit.storyFactory(() => DEMO_HTML, {}).addStyle(DEMO_STYLE);

const TABS_HTML = (slot?: () => TemplateResult) => html`
  <div class="tabs-wrapper">
    <bn-slider-tabs id="tabs" for-slider="qaq">
      <span class="tab" slot="tab">s1</span>
      <span class="tab" slot="tab">s2</span>
      <span class="tab" slot="tab">s3</span>
    </bn-slider-tabs>
    ${slot?.()}
  </div>
`;

const TABS_STYLE = `
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
}
bn-slider-tabs > .tab{
 width: 3em;
 text-align:center;
}
bn-slider-tabs > .tab[data-bn-slider-tabs="actived"]{
  font-weight: bold;
  transform: scale(1.1);
  transition-duration: 250ms;
}
bn-slider {
  border-radius: 2em;
}
`;
export const With_Tabs = bnSliderKit
  .storyFactory(() => DEMO_HTML, {})
  .addStyle(DEMO_STYLE)
  .onMount((_, ele) => {
    ele.id = "qaq";
  })
  .addHtmlTpl(TABS_HTML(), "before")
  .addStyle(TABS_STYLE);

export const Delay_Visible = bnSliderKit
  .storyFactory(() => DEMO_HTML, {
    defaultActivedIndex: 1,
  })
  .addStyle(DEMO_STYLE)
  .onMount((_, ele) => {
    ele.id = "qaq";
    ele.classList.add("hide");
  })
  .addHtmlTpl(TABS_HTML(), "before")
  .addStyle(TABS_STYLE)
  .addStyle(
    `
  #wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #wrapper.hide {
    display: none;
  }`,
  )
  .addHtmlTpl(
    html` <div id="wrapper" class="hide"></div>
      <button id="qaq-toggle">Toggle Visiable</button>`,
  )
  .onMount((frag, ele) => {
    const wrapperEle = frag.querySelector<HTMLDivElement>("#wrapper")!;
    wrapperEle.appendChild(frag.querySelector("bn-slider-tabs")!);
    wrapperEle.appendChild(ele);

    const cacheFrag = document.createDocumentFragment();
    cacheFrag.append(...ele.childNodes);

    frag.querySelector<HTMLButtonElement>("#qaq-toggle")!.onclick = () => {
      if (wrapperEle.classList.toggle("hide")) {
        cacheFrag.append(...ele.childNodes);
      } else {
        setTimeout(() => {
          ele.append(cacheFrag);
        }, 1000);
      }
    };
  });

export const With_Tabs_And_Default_Index = bnSliderKit
  .storyFactory(() => DEMO_HTML, {
    defaultActivedIndex: 1,
  })
  .addStyle(DEMO_STYLE)
  .onMount((_, ele) => {
    ele.id = "qaq";
  })
  .addHtmlTpl(TABS_HTML(), "before")
  .addStyle(TABS_STYLE);

export const With_Tabs_And_Scrollbar = bnSliderKit
  .storyFactory(() => DEMO_HTML, {
    defaultActivedIndex: 1,
  })
  .addStyle(DEMO_STYLE)
  .onMount((_, ele) => {
    ele.id = "qaq";
  })
  .addStyle(TABS_STYLE)
  .addHtmlTpl(
    TABS_HTML(
      () => html` <bn-slider-scrollbar id="scrollbar" for-slider="qaq" for-layout="tabs"> </bn-slider-scrollbar> `,
    ),
    "before",
  ).addStyle(`
  .tabs-wrapper{
    display:flex;
    flex-direction: column;
  }
  `);

export const Nested_Slider = bnSliderKit
  .storyFactory(
    () => html`<div slot="slider" class="slider item-1">
        <bn-slider-tabs for-slider="s1">
          <span class="tab" slot="tab">s1.1</span>
          <span class="tab" slot="tab">s1.2</span>
          <span class="tab" slot="tab">s1.3</span>
        </bn-slider-tabs>
        <bn-slider id="s1">
          <div slot="slider" class="slider item-1">你好1</div>
          <div slot="slider" class="slider item-2">你好2</div>
          <div slot="slider" class="slider item-3">你好3</div>
        </bn-slider>
      </div>
      <div slot="slider" class="slider item-2">
        <bn-slider-tabs for-slider="s2">
          <span class="tab" slot="tab">s2.1</span>
          <span class="tab" slot="tab">s2.2</span>
          <span class="tab" slot="tab">s2.3</span>
        </bn-slider-tabs>
        <bn-slider id="s2">
          <div slot="slider" class="slider item-1">你好1</div>
          <div slot="slider" class="slider item-2">你好2</div>
          <div slot="slider" class="slider item-3">你好3</div>
        </bn-slider>
      </div>
      <div slot="slider" class="slider item-3">
        <bn-slider-tabs for-slider="s3">
          <span class="tab" slot="tab">s3.1</span>
          <span class="tab" slot="tab">s3.2</span>
          <span class="tab" slot="tab">s3.3</span>
        </bn-slider-tabs>
        <bn-slider id="s3">
          <div slot="slider" class="slider item-1">你好1</div>
          <div slot="slider" class="slider item-2">你好2</div>
          <div slot="slider" class="slider item-3">你好3</div>
        </bn-slider>
      </div>`,
    {},
  )
  .addStyle(DEMO_STYLE)
  .onMount((_, ele) => {
    ele.id = "qaq";
  })
  .addHtmlTpl(
    html`
      <bn-slider-tabs for-slider="qaq">
        <span class="tab" slot="tab">s1</span>
        <span class="tab" slot="tab">s2</span>
        <span class="tab" slot="tab">s3</span>
      </bn-slider-tabs>
    `,
    "before",
  )
  .addStyle(
    TABS_STYLE +
      `
  .slider bn-slider {
    width: 260px;
  }
  `,
  );

import { html, TemplateResult } from "lit-html";
import { bnSliderKit } from "./autogen";
import { DEMO_HTML, DEMO_STYLE, TABS_HTML, TABS_STYLE } from "./bn-slider.const";

export default {
  title: "Component/Slider/Slider",
  argTypes: bnSliderKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnSliderKit.storyFactory(() => DEMO_HTML, {}).addStyle(DEMO_STYLE);

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

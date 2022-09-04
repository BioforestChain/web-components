import { html } from "lit-html";
import { bnSliderTabsKit } from "./autogen";

export default {
  title: "Component/Slider/Slider Tabs",
  argTypes: bnSliderTabsKit.argsFactory.toArgTypes(),
};

const BASE_HTML = html`
  <span slot="tab"> 关 </span>
  <span slot="tab"> 最新 </span>
  <span slot="tab"> 热榜注 </span>
  <span slot="tab"> 你好 </span>
  <span slot="tab"> 世 </span>
`;
const BASE_STYLE = `
bn-slider-tabs {
  outline: 1px solid red;
}

[slot="tab"]{
  padding: 0.5em 1em;
  transition-duration: 300ms;
}
[slot="tab"][data-bn-slider-tabs="prev"]{
  background: #c8e6c9;
}
[slot="tab"][data-bn-slider-tabs="actived"]{
  background: #009688;
  color: #FFF;
}
[slot="tab"][data-bn-slider-tabs="next"]{
  background: #b3e5fc;
}
`;

export const Base_Usage = bnSliderTabsKit.storyFactory(() => BASE_HTML, {}).addStyle(BASE_STYLE);

export const WithDefaultIndex = bnSliderTabsKit
  .storyFactory(() => BASE_HTML, { defaultActivedIndex: 1 })
  .addStyle(BASE_STYLE);

export const WithScrollBar = bnSliderTabsKit
  .storyFactory(() => html`${BASE_HTML}`)
  .addStyle(BASE_STYLE)
  .addHtmlTpl(html` <bn-slider-scrollbar for-layout="qaq" for-slider="qaq"></bn-slider-scrollbar> `)
  .onMount((_, ele) => {
    ele.id = "qaq";
  });

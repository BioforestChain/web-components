import { html } from "lit-html";
import { cccSliderTabsKit } from "./autogen";

export default {
  title: "Component/Slider/Slider Tabs",
  argTypes: cccSliderTabsKit.argsFactory.toArgTypes(),
};

const BASE_HTML = html`
  <span slot="tab"> 关 </span>
  <span slot="tab"> 最新 </span>
  <span slot="tab"> 热榜注 </span>
  <span slot="tab"> 你好 </span>
  <span slot="tab"> 世 </span>
`;
const BASE_STYLE = `
ccc-slider-tabs {
  outline: 1px solid red;
}

[slot="tab"]{
  padding: 0.5em 1em;
  transition-duration: 300ms;
}
[slot="tab"][data-ccc-slider-tabs="prev"]{
  background: #c8e6c9;
}
[slot="tab"][data-ccc-slider-tabs="actived"]{
  background: #009688;
  color: #FFF;
}
[slot="tab"][data-ccc-slider-tabs="next"]{
  background: #b3e5fc;
}
`;

export const Base_Usage = cccSliderTabsKit.storyFactory(() => BASE_HTML, {}).addStyle(BASE_STYLE);

export const WithDefaultIndex = cccSliderTabsKit
  .storyFactory(() => BASE_HTML, { defaultActivedIndex: 1 })
  .addStyle(BASE_STYLE);

export const WithScrollBar = cccSliderTabsKit
  .storyFactory(
    () => html`${BASE_HTML}
      <ccc-slider-scrollbar for-layout="qaq" for-slider="qaq"></ccc-slider-scrollbar> `,
  )
  .addStyle(BASE_STYLE)
  .onMount((_, ele) => {
    ele.id = "qaq";
  });

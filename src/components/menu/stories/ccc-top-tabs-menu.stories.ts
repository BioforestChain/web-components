import { html } from "lit-html";
import { cccTopTabsMenuKit } from "./autogen";

export default {
  title: "Component/Menu/Top Tabs",
  argTypes: cccTopTabsMenuKit.argsFactory.toArgTypes(),
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
export const Base_Usage = cccTopTabsMenuKit.storyFactory(() => BASE_HTML, {}).addStyle(BASE_STYLE);

const SLIDER_HTML = html`<ccc-slider id="qaq">
  <div slot="slider" class="slider item-1">
    <h2>slider 1</h2>
  </div>
  <div slot="slider" class="slider item-2">
    <h2>slider 2</h2>
  </div>
  <div slot="slider" class="slider item-3">
    <h2>slider 3</h2>
  </div>
  <div slot="slider" class="slider item-2">
    <h2>slider 4</h2>
  </div>
  <div slot="slider" class="slider item-1">
    <h2>slider 5</h2>
  </div>
</ccc-slider>`;
const SLIDER_STYLE = `
ccc-slider{
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

export const With_Slider = cccTopTabsMenuKit
  .storyFactory(() => BASE_HTML, { forSlider: "qaq" })
  .addStyle(BASE_STYLE)
  .addHtmlTpl(SLIDER_HTML)
  .addStyle(SLIDER_STYLE);
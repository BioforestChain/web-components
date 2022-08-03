import { html } from "lit-html";
import { cccSliderKit } from "./autogen";

export default {
  title: "Component/Slider/Slider",
  argTypes: cccSliderKit.argsFactory.toArgTypes(),
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
  ccc-slider{
    width: 300px;
  }
  .slider {
    width: 300px;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: auto;
  }
  .item-1{
    background: #e91e63;
  }
  .item-2{
    background: #4caf50;
    justify-content: flex-start;
  }
  .item-3{
    background: #2196f3;
  }
  `;

export const Base_Usage = cccSliderKit.storyFactory(() => DEMO_HTML, {}).addStyle(DEMO_STYLE);
export const With_Tabs = cccSliderKit
  .storyFactory(() => DEMO_HTML, {})
  .addStyle(DEMO_STYLE)
  .onMount((_, ele) => {
    ele.id = "qaq";
  })
  .addHtmlTpl(
    html`
      <ccc-slider-tabs for="qaq">
        <span class="tab" slot="tab">s1</span>
        <span class="tab" slot="tab">s2</span>
        <span class="tab" slot="tab">s3</span>
      </ccc-slider-tabs>
    `,
    "before",
  ).addStyle(`
  ccc-slider-tabs > .tab{
   width: 3em;
   text-align:center;
  }
  ccc-slider-tabs > .tab[data-ccc-slider-tabs="actived"]{
    font-weight: bold;
    transform: scale(1.1);
    transition-duration: 250ms;
  }
  `);

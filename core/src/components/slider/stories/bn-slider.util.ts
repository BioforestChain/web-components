import { html, TemplateResult } from "lit-html";

export const DEMO_HTML = html`<div slot="slider" class="slider item-1">
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
export const DEMO_STYLE = `
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
export const TABS_STYLE = `
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

export const TABS_HTML = (slot?: () => TemplateResult) => html`
  <div class="tabs-wrapper">
    <bn-slider-tabs id="tabs" for-slider="qaq">
      <span class="tab" slot="tab">s1</span>
      <span class="tab" slot="tab">s2</span>
      <span class="tab" slot="tab">s3</span>
    </bn-slider-tabs>
    ${slot?.()}
  </div>
`;

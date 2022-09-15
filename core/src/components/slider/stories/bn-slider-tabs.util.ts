import { html } from "lit-html";

export const BASE_HTML = html`
  <span slot="tab"> 关 </span>
  <span slot="tab"> 最新 </span>
  <span slot="tab"> 热榜注 </span>
  <span slot="tab"> 你好 </span>
  <span slot="tab"> 世 </span>
`;
export const BASE_STYLE = `
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

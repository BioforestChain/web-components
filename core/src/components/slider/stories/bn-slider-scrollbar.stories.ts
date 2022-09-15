import { html } from "lit-html";
import { bnSliderKit, bnSliderScrollbarKit, bnSliderTabsKit } from "./autogen";
import * as SLIDER_TABS_CONST from "./bn-slider-tabs.util";
import * as SLIDER_CONST from "./bn-slider.util";

export default {
  title: "Component/Slider/Slider Scrollbar",
  argTypes: bnSliderScrollbarKit.argsFactory.toArgTypes(),
};

// export const Base_Usage = bnSliderScrollbarKit.storyFactory(
//   () =>
//     html`<span>slider-scrollbar demo</span>`,
//   {
//     // data: 0,
//   },
// );
export const ForSliderTabs = bnSliderTabsKit
  .storyFactory(() => html`${SLIDER_TABS_CONST.BASE_HTML}`)
  .addStyle(SLIDER_TABS_CONST.BASE_STYLE)
  .addHtmlTpl(html` <bn-slider-scrollbar for-layout="qaq" for-slider="qaq"></bn-slider-scrollbar> `)
  .onMount((_, ele) => {
    ele.id = "qaq";
  });

export const ForSlider = bnSliderKit
  .storyFactory(() => SLIDER_CONST.DEMO_HTML, {
    defaultActivedIndex: 1,
  })
  .addStyle(SLIDER_CONST.DEMO_STYLE)
  .onMount((_, ele) => {
    ele.id = "qaq";
  })
  .addStyle(SLIDER_CONST.TABS_STYLE)
  .addHtmlTpl(
    SLIDER_CONST.TABS_HTML(
      () => html` <bn-slider-scrollbar id="scrollbar" for-slider="qaq" for-layout="tabs"> </bn-slider-scrollbar> `,
    ),
    "before",
  ).addStyle(`
  .tabs-wrapper{
    display:flex;
    flex-direction: column;
  }
  `);

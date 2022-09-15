import { html } from "lit-html";
import { bnSliderTabsKit } from "./autogen";
import { BASE_HTML, BASE_STYLE } from "./bn-slider-tabs.util";

export default {
  title: "Component/Slider/Slider Tabs",
  argTypes: bnSliderTabsKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnSliderTabsKit.storyFactory(() => BASE_HTML, {}).addStyle(BASE_STYLE);

export const WithDefaultIndex = bnSliderTabsKit
  .storyFactory(() => BASE_HTML, { defaultActivedIndex: 1 })
  .addStyle(BASE_STYLE);

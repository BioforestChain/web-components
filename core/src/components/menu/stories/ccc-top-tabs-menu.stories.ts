import { html } from "lit-html";
import { cccTopTabsMenuKit } from "./autogen";
import { TABS_HTML, TABS_STYLE, SLIDER_HTML, SLIDER_STYLE } from "./const";

export default {
  title: "Component/Menu/Top Tabs",
  argTypes: cccTopTabsMenuKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccTopTabsMenuKit.storyFactory(() => TABS_HTML, {}).addStyle(TABS_STYLE);

export const With_Slider = cccTopTabsMenuKit
  .storyFactory(() => TABS_HTML, { forSlider: "qaq" })
  .addStyle(TABS_STYLE)
  .addHtmlTpl(SLIDER_HTML)
  .addStyle(SLIDER_STYLE);

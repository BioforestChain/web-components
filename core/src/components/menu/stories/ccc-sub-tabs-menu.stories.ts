import { cccSubTabsMenuKit } from "./autogen";
import { SLIDER_HTML, SLIDER_STYLE, TABS_HTML, TABS_STYLE } from "./const";

export default {
  title: "Component/Menu/Sub Tabs",
  argTypes: cccSubTabsMenuKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccSubTabsMenuKit.storyFactory(() => TABS_HTML, {}).addStyle(TABS_STYLE);
export const With_Slider = cccSubTabsMenuKit
  .storyFactory(() => TABS_HTML, { forSlider: "qaq" })
  .addStyle(TABS_STYLE)
  .addHtmlTpl(SLIDER_HTML)
  .addStyle(SLIDER_STYLE);

import { html } from "lit-html";
import { cccSliderTabsKit } from "./autogen";

export default {
  title: "Component/Slider/Slider Tabs",
  argTypes: cccSliderTabsKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccSliderTabsKit.storyFactory(
  () =>
    html`
      <span slot="tab">
        <button>关注~~</button>
      </span>
      <span slot="tab">
        <button>最新最新最新最新!!</button>
      </span>
      <span slot="tab">热榜</span>
    `,
  {
    // init property/attribute
    // data: 0,
  },
).addStyle(`
ccc-tabs-slider {
  outline: 1px solid red;
}
`);

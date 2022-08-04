import { html } from "lit-html";
import { cccStackingUtilKit } from "./autogen";

export default {
  title: "Component/Util/Stacking",
  argTypes: cccStackingUtilKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccStackingUtilKit
  .storyFactory(
    () =>
      // push some child element
      html``,
    { text: "你好呀~" },
  )
  .onMount((_, ele) => {
    ele.id = "qaq";
  }).addStyle(`
#qaq::part(front) {
  color: rgba(0,0,255,0.5);
}
#qaq::part(back) {
  color: rgba(255,0,0,0.5);
}
`);

export const Use_Slot = cccStackingUtilKit.storyFactory(
  () =>
    // push some child element
    html`<span class="t1" slot="layer">text one !!</span> <span class="t2" slot="layer">text two</span>`,
  {},
).addStyle(`
.t1{
  color: rgba(0,0,255,0.5);
}
.t2{
  color: red;
  color: rgba(255,0,0,0.5);
}
`);

import { html } from "lit-html";
import { bnLazyKit } from "./autogen";

export default {
  title: "Component/Lazy",
  argTypes: bnLazyKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnLazyKit
  .storyFactory(
    () =>
      // push some child element
      html`<span slot="weakup">
          lazy demo
          <br />
          lazy demo
          <br />
          lazy demo
          <br />
          lazy demo
          <br />
          lazy demo
          <br />
        </span>
        <div class="loading" slot="sleep">Loading</div> `,
    {
      // init property/attribute
      // data: 0,
    },
  )
  .addStyle(
    `
      .loading {
        height: 100%;
        display: grid;
        justify-content: center;
        align-items: center;

        background: red;
      }
    `,
  )
  .addHtmlTpl(
    html`<div id="scrollview">
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block after"></div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
    </div>`,
  )
  .addStyle(
    `
    #scrollview {
      height:200px;
      overflow: auto;
    }
    .block {
      height: 50px;
      margin: 10px;
      background: blue;
    }`,
  )
  .onMount((frag, ele) => {
    frag.querySelector("#scrollview")?.insertBefore(ele, frag.querySelector(".after"));
  });

export const AutoSleep = Base_Usage.clone({ autoSleep: true });

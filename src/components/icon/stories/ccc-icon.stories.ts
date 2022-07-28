import { html, render } from "lit-html";
import { cccIconKit } from "./autogen";

export default {
  title: "Component/Icon",
  argTypes: cccIconKit.argsFactory.toArgTypes(),
};

export const Base_Usage = cccIconKit
  .storyFactory(() => html``, {
    name: "like",
    label: "like~~",
  })
  .onMount(frag => {
    const iconEle = frag.firstElementChild! as HTMLCccIconElement;

    const allIcons = [
      "small-down",
      "paper-plane",
      "cancel",
      "link",
      "warning",
      "eye",
      "big-currency",
      "history",
      "collection",
      "circle-diamond",
      "comment",
      "share",
      "check",
      "dislike",
      "like",
    ] as const;
    const allIconEles: HTMLCccIconElement[] = [];
    for (const name of allIcons) {
      const ele = iconEle.cloneNode(true) as HTMLCccIconElement;
      ele.name = name;
      // ele.label = name;
      ele.innerHTML = `<span slot="label">${name}</span>`;
      frag.appendChild(ele);
      allIconEles.push(ele);
    }
    // iconEle.style.display = "none";

    new MutationObserver(() => {
      for (const ele of allIconEles) {
        ele.direction = iconEle.direction;
      }
    }).observe(iconEle, { attributeFilter: ["direction"] });
    // frag.removeChild(iconEle);

    const style = document.createElement("style");
    style.innerHTML = `#root {
      display: flex;
      flex-wrap: wrap;
      gap: 1em;
      font-size: 2em;

      --label-font-size: 0.5em;
    }
    ccc-icon {
      outline: 1px solid rgba(255,255,0,0.3);
    }`;
    frag.appendChild(style);
  });

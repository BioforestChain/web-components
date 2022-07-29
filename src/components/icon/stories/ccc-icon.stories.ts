import { html } from "lit-html";
import allIcons from "../assets/cccicon.json";
import type { $CccIconName } from "../ccc-icon.name";
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

    const allIconEles: HTMLCccIconElement[] = [];
    for (const name in allIcons) {
      const ele = iconEle.cloneNode(true) as HTMLCccIconElement;
      ele.name = name as $CccIconName;
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
      --font-size: 2em;

    }
    ccc-icon {
      outline: 1px solid rgba(255,255,0,0.3);
    }`;
    frag.appendChild(style);
  });

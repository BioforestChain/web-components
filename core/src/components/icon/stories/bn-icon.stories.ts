import { html } from "lit-html";
import allIcons from "../assets/bnicon.json";
import type { $BnIconName } from "../bn-icon.name";
import { bnIconKit } from "./autogen";

export default {
  title: "Component/Icon",
  argTypes: bnIconKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnIconKit
  .storyFactory(() => html``, {
    name: "like",
    label: "like~~",
  })
  .onMount(frag => {
    const iconEle = frag.firstElementChild! as HTMLBnIconElement;

    const allIconEles: HTMLBnIconElement[] = [];
    for (const name in allIcons) {
      const ele = iconEle.cloneNode(true) as HTMLBnIconElement;
      ele.name = name as $BnIconName;
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
    bn-icon {
      outline: 1px solid rgba(255,255,0,0.3);
    }`;
    frag.appendChild(style);
  });

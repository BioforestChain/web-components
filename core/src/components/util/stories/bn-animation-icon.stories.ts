import { html, render } from "lit-html";
import { querySelector } from "../../../utils/utils";
import { bnAnimationIconKit } from "./autogen";

export default {
  title: "Component/Icon/Animation",
  argTypes: bnAnimationIconKit.argsFactory.toArgTypes(),
};

export const Base_Usage = bnAnimationIconKit
  .storyFactory(() => html``, {
    src: "./src/components/button/assets/collect.webp",
    duration: "1.6s",
    frames: 48,
  })
  .onMount(frag => {
    frag.appendChild(
      render(
        html`
          <button id="my_play">Play</button>
          <button id="my_pause">Pause</button>
          <button id="my_reset">Reset</button>

          <style>
            bn-animation-icon {
              background-color: grey;
            }
            bn-animation-icon::part(viewbox) {
              background-size: auto 200%;
            }
          </style>
        `,
        document.createDocumentFragment(),
      ).parentNode,
    );
    const hostEle = frag.firstElementChild as HTMLBnAnimationIconElement;
    querySelector<HTMLButtonElement>(frag, "#my_play")!.onclick = () => {
      hostEle.play();
    };
    querySelector<HTMLButtonElement>(frag, "#my_pause")!.onclick = () => {
      hostEle.pause();
    };
    querySelector<HTMLButtonElement>(frag, "#my_reset")!.onclick = () => {
      hostEle.reset();
    };
  });

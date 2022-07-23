import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccButtonQaqKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccButtonQaq>();

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccButtonQaq>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccButtonQaq>,
  ) => {
    return defineStory<JSX.CccButtonQaq>(args => {
      return html`<ccc-button-qaq>
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-button-qaq>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory };
})();

export const cccButtonQwqKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccButtonQwq>();

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccButtonQwq>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccButtonQwq>,
  ) => {
    return defineStory<JSX.CccButtonQwq>(args => {
      return html`<ccc-button-qwq>
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-button-qwq>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory };
})();

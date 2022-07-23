import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const myNameKit = (() => {
  const argsFactory = new ArgFactory<JSX.MyName>();

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.MyName>>) => HTMLTemplateResult,
    args?: Partial<JSX.MyName>,
  ) => {
    return defineStory<JSX.MyName>(args => {
      return html`<my-name>
        <!-- custom child elements -->
        ${slot(args)}
      </my-name>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory };
})();

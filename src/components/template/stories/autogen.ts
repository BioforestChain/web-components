import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccTemplateKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccTemplate>()
    .defineNumber("data", {
      defaultValue: 0,
      description: "click count",
    })
    .defineAction("onCountChanged", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccTemplate>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccTemplate>,
  ) => {
    return defineStory<JSX.CccTemplate>(args => {
      return html`<ccc-template .data=${args.data} @countChanged=${args.onCountChanged}>
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-template>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory };
})();

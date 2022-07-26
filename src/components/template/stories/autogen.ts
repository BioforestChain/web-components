import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccTemplateKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccTemplate>()
    .defineNumber("count", {
      defaultValue: 0,
      description: "click count",
      required: false,
    })
    .defineAction("onCountChanged", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccTemplate>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccTemplate>,
  ) => {
    return defineStory<JSX.CccTemplate>(args => {
      return html`<ccc-template .count=${args.count} @countChanged=${args.onCountChanged}>
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-template>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccTemplate> };
})();

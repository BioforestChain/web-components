import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccCommentIconKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccCommentIcon>()
    .defineEnum("direction", ["lr", "tb"], {
      defaultValue: "lr",
      description: "",
      required: false,
    })
    .defineString("label", {
      defaultValue: "",
      description: "",
      required: false,
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccCommentIcon>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccCommentIcon>,
  ) => {
    return defineStory<JSX.CccCommentIcon>(args => {
      return html`<ccc-comment-icon .direction=${args.direction} .label=${args.label}>
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-comment-icon>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccCommentIcon> };
})();

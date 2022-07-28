import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccIconKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccIcon>()
    .defineEnum("direction", ["lr", "tb"], {
      defaultValue: "lr",
      description: "",
      required: false,
    })
    .defineString("label", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineEnum(
      "name",
      [
        "big-currency",
        "cancel",
        "check",
        "circle-diamond",
        "collection",
        "comment",
        "dislike",
        "eye",
        "history",
        "like",
        "link",
        "paper-plane",
        "share",
        "small-down",
        "warning",
      ],
      {
        defaultValue: undefined,
        description: "",
        required: true,
      },
    )
    .defineAction("onCountChanged", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccIcon>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccIcon>,
  ) => {
    return defineStory<JSX.CccIcon>(args => {
      return html`<ccc-icon
        .direction=${args.direction}
        .label=${args.label}
        .name=${args.name}
        @countChanged=${args.onCountChanged}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-icon>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccIcon> };
})();

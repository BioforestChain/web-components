import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccCollectButtonKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccCollectButton>()
    .defineString("checkLabel", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineBoolean("checked", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineEnum("direction", ["lr", "tb"], {
      defaultValue: "lr",
      description: "",
      required: false,
    })
    .defineBoolean("disabled", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineBoolean("icononly", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineString("unCheckLabel", {
      defaultValue: "",
      description: "",
      required: false,
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccCollectButton>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccCollectButton>,
  ) => {
    return defineStory<JSX.CccCollectButton>(args => {
      return html`<ccc-collect-button
        .checkLabel=${args.checkLabel}
        ?checked=${args.checked}
        .direction=${args.direction}
        ?disabled=${args.disabled}
        ?icononly=${args.icononly}
        .unCheckLabel=${args.unCheckLabel}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-collect-button>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccCollectButton> };
})();

export const cccDislikeButtonKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccDislikeButton>()
    .defineBoolean("checked", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineNumber("count", {
      defaultValue: 0,
      description: "",
      required: false,
    })
    .defineEnum("direction", ["lr", "tb"], {
      defaultValue: "lr",
      description: "",
      required: false,
    })
    .defineBoolean("disabled", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineBoolean("icononly", {
      defaultValue: false,
      description: "",
      required: false,
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccDislikeButton>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccDislikeButton>,
  ) => {
    return defineStory<JSX.CccDislikeButton>(args => {
      return html`<ccc-dislike-button
        ?checked=${args.checked}
        .count=${args.count}
        .direction=${args.direction}
        ?disabled=${args.disabled}
        ?icononly=${args.icononly}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-dislike-button>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccDislikeButton> };
})();

export const cccLikeButtonKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccLikeButton>()
    .defineBoolean("checked", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineNumber("count", {
      defaultValue: 0,
      description: "",
      required: false,
    })
    .defineEnum("direction", ["lr", "tb"], {
      defaultValue: "lr",
      description: "",
      required: false,
    })
    .defineBoolean("disabled", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineBoolean("icononly", {
      defaultValue: false,
      description: "",
      required: false,
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccLikeButton>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccLikeButton>,
  ) => {
    return defineStory<JSX.CccLikeButton>(args => {
      return html`<ccc-like-button
        ?checked=${args.checked}
        .count=${args.count}
        .direction=${args.direction}
        ?disabled=${args.disabled}
        ?icononly=${args.icononly}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-like-button>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccLikeButton> };
})();

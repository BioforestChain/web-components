import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const myComponentKit = (() => {
  const argsFactory = new ArgFactory<JSX.MyComponent>()
    .defineString("first", {
      defaultValue: undefined,
      description: "The first name",
    })
    .defineString("last", {
      defaultValue: undefined,
      description: "The last name",
    })
    .defineString("middle", {
      defaultValue: undefined,
      description: "The middle name",
    })
    .defineAction("onNamed", {
      description: "name changed!",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.MyComponent>>) => HTMLTemplateResult,
    args?: Partial<JSX.MyComponent>,
  ) => {
    return defineStory<JSX.MyComponent>(args => {
      return html`<my-component .first=${args.first} .last=${args.last} .middle=${args.middle} @named=${args.onNamed}>
        <!-- custom child elements -->
        ${slot(args)}
      </my-component>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory };
})();

export const myComponent2Kit = (() => {
  const argsFactory = new ArgFactory<JSX.MyComponent2>()
    .defineString("first2", {
      defaultValue: undefined,
      description: "The first name",
    })
    .defineString("last2", {
      defaultValue: undefined,
      description: "The last name",
    })
    .defineString("middle2", {
      defaultValue: undefined,
      description: "The middle name",
    })
    .defineAction("onNamed2", {
      description: "name changed!",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.MyComponent2>>) => HTMLTemplateResult,
    args?: Partial<JSX.MyComponent2>,
  ) => {
    return defineStory<JSX.MyComponent2>(args => {
      return html`<my-component2
        .first2=${args.first2}
        .last2=${args.last2}
        .middle2=${args.middle2}
        @named2=${args.onNamed2}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </my-component2>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory };
})();

import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccSliderKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccSlider>();

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccSlider>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccSlider>,
  ) => {
    return defineStory<JSX.CccSlider>(args => {
      return html`<ccc-slider>
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-slider>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccSlider> };
})();

export const cccSliderTabsKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccSliderTabs>()
    .defineNumber("activedIndex", {
      defaultValue: 0,
      description: "",
      required: false,
    })
    .defineString("for", {
      defaultValue: undefined,
      description: "the <ccc-silder> element id",
      required: false,
    })
    .defineAction("onActivedTabChange", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccSliderTabs>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccSliderTabs>,
  ) => {
    return defineStory<JSX.CccSliderTabs>(args => {
      return html`<ccc-slider-tabs
        .activedIndex=${args.activedIndex}
        .for=${args.for}
        @activedTabChange=${args.onActivedTabChange}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-slider-tabs>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccSliderTabs> };
})();

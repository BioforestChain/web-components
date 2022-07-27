import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccAnimationIconKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccAnimationIcon>()
    .defineBoolean("actived", {
      defaultValue: false,
      description: "动画的状态",
      required: false,
    })
    .defineEnum("direction", ["bt", "lr", "rl", "tb"], {
      defaultValue: "lr",
      description: "动画步进方向",
      required: false,
    })
    .defineString("duration", {
      defaultValue: undefined,
      description: "动画时长",
      required: true,
    })
    .defineNumber("frames", {
      defaultValue: undefined,
      description: "帧数",
      required: true,
    })
    .defineString("height", {
      defaultValue: undefined,
      description: "画框高度",
      required: false,
    })
    .defineNumber("ratio", {
      defaultValue: undefined,
      description: "画框比例",
      required: false,
    })
    .defineString("src", {
      defaultValue: undefined,
      description: "图片地址",
      required: true,
    })
    .defineString("width", {
      defaultValue: undefined,
      description: "画框宽度",
      required: false,
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccAnimationIcon>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccAnimationIcon>,
  ) => {
    return defineStory<JSX.CccAnimationIcon>(args => {
      return html`<ccc-animation-icon
        ?actived=${args.actived}
        .direction=${args.direction}
        .duration=${args.duration}
        .frames=${args.frames}
        .height=${args.height}
        .ratio=${args.ratio}
        .src=${args.src}
        .width=${args.width}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-animation-icon>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccAnimationIcon> };
})();

export const cccImageToggleButtonKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccImageToggleButton>()
    .defineBoolean("checked", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineString("checkedColor", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineEnum("color", ["black", "white"], {
      defaultValue: "black",
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
    .defineString("duration", {
      defaultValue: undefined,
      description: "",
      required: true,
    })
    .defineNumber("frames", {
      defaultValue: undefined,
      description: "",
      required: true,
    })
    .defineBoolean("icononly", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineString("label", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineString("src", {
      defaultValue: undefined,
      description: "",
      required: true,
    })
    .defineAction("onCheckedChange", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccImageToggleButton>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccImageToggleButton>,
  ) => {
    return defineStory<JSX.CccImageToggleButton>(args => {
      return html`<ccc-image-toggle-button
        ?checked=${args.checked}
        .checkedColor=${args.checkedColor}
        .color=${args.color}
        .direction=${args.direction}
        ?disabled=${args.disabled}
        .duration=${args.duration}
        .frames=${args.frames}
        ?icononly=${args.icononly}
        .label=${args.label}
        .src=${args.src}
        @checkedChange=${args.onCheckedChange}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-image-toggle-button>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccImageToggleButton> };
})();

export const cccLottieWebKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccLottieWeb>()
    .defineBoolean("actived", {
      defaultValue: false,
      description: "是否要将动画至于末尾帧？",
      required: false,
    })
    .defineBoolean("autoplay", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineObject("data", {
      defaultValue: undefined,
      description: "",
      required: false,
    })
    .defineString("defaultActivedColor", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineEnum("direction", [-1, 1], {
      defaultValue: 1,
      description: "",
      required: false,
    })
    .defineBoolean("loop", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineString("name", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineEnum("renderer", ["canvas", "html", "svg"], {
      defaultValue: "svg",
      description: "渲染类型",
      required: false,
    })
    .defineString("src", {
      defaultValue: undefined,
      description: "",
      required: false,
    })
    .defineAction("onCountChanged", {
      description: "",
    })
    .defineAction("onDefaultActivedColorChange", {
      description: "",
    })
    .defineAction("onEndFrame", {
      description: "",
    })
    .defineAction("onStartFrame", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccLottieWeb>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccLottieWeb>,
  ) => {
    return defineStory<JSX.CccLottieWeb>(args => {
      return html`<ccc-lottie-web
        ?actived=${args.actived}
        ?autoplay=${args.autoplay}
        .data=${args.data}
        .defaultActivedColor=${args.defaultActivedColor}
        .direction=${args.direction}
        ?loop=${args.loop}
        .name=${args.name}
        .renderer=${args.renderer}
        .src=${args.src}
        @countChanged=${args.onCountChanged}
        @defaultActivedColorChange=${args.onDefaultActivedColorChange}
        @endFrame=${args.onEndFrame}
        @startFrame=${args.onStartFrame}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-lottie-web>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccLottieWeb> };
})();

export const cccLottieWebToggleButtonKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccLottieWebToggleButton>()
    .defineObject("animationData", {
      defaultValue: undefined,
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
    .defineString("label", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineString("labelColor", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineString("name", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineAction("onCheckedChange", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccLottieWebToggleButton>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccLottieWebToggleButton>,
  ) => {
    return defineStory<JSX.CccLottieWebToggleButton>(args => {
      return html`<ccc-lottie-web-toggle-button
        .animationData=${args.animationData}
        ?checked=${args.checked}
        .direction=${args.direction}
        ?disabled=${args.disabled}
        ?icononly=${args.icononly}
        .label=${args.label}
        .labelColor=${args.labelColor}
        .name=${args.name}
        @checkedChange=${args.onCheckedChange}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-lottie-web-toggle-button>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccLottieWebToggleButton> };
})();

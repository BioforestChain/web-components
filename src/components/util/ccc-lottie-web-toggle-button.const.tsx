import { h } from "@stencil/core";

const colorsMap = new WeakMap<object, { checked: string; unchecked: string }>();
export const forceGetLottieToggleButtonColors = (aniData: object) => {
  let colors = colorsMap.get(aniData);
  if (colors === undefined) {
    colors = {
      checked: "",
      unchecked: "inherit",
    };
    colorsMap.set(aniData, colors);
  }
  return colors;
};

export interface $LottieToggleButton {
  checked: boolean;
  direction: $LottieToggleButton.Direction;
  disabled: boolean;
  icononly: boolean;
  onChange: (event: CustomEvent<boolean>) => void;
}
export namespace $LottieToggleButton {
  export type Direction = "tb" | "lr"; // "column" | "row";
}

export const lottieToggleButtonRender = (
  name: string,
  animationData: object,
  button: $LottieToggleButton,
  slotRender: () => unknown,
) => {
  return (
    <ccc-lottie-web-toggle-button
      class="icon"
      name={name}
      direction={button.direction}
      disabled={button.disabled}
      animationData={animationData}
      icononly={button.icononly}
      checked={button.checked}
      onCheckedChange={button.onChange}
    >
      {slotRender()}
    </ccc-lottie-web-toggle-button>
  );
};

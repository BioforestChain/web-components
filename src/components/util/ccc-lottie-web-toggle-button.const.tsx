import { h } from "@stencil/core";

export type $Direction = "tb" | "lr"; // "column" | "row";
export const colorsMap = new WeakMap<object, { checked: string; unchecked: string }>();
export const forceGetColors = (aniData: object) => {
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

export interface $ToggleButton {
  checked: boolean;
  direction: $Direction;
  disabled: boolean;
  icononly: boolean;
  onChange: (event: CustomEvent<boolean>) => void;
}
export const toggleButtonRender = (
  name: string,
  animationData: object,
  button: $ToggleButton,
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

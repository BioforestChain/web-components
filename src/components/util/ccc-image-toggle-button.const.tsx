import { h } from "@stencil/core";

export type $Direction = "tb" | "lr"; // "column" | "row";
export type $Color = "white" | "black"; // "column" | "row";

export interface $ToggleButton {
  checked: boolean;
  color: $Color;
  direction: $Direction;
  disabled: boolean;
  icononly: boolean;
  onChange: (event: CustomEvent<boolean>) => void;
}
export const toggleButtonRender = (
  aniConfig: {
    src: string;
    frames: number;
    duration: string;
    checkedColor: string;
  },
  button: $ToggleButton,
  slotRender: () => unknown,
) => {
  return (
    <ccc-image-toggle-button
      class="icon"
      src={aniConfig.src}
      frames={aniConfig.frames}
      duration={aniConfig.duration}
      checkedColor={aniConfig.checkedColor}
      direction={button.direction}
      color={button.color}
      disabled={button.disabled}
      icononly={button.icononly}
      checked={button.checked}
      onCheckedChange={button.onChange}
    >
      {slotRender()}
    </ccc-image-toggle-button>
  );
};

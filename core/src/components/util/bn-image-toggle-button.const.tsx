import { h } from "@stencil/core";

export interface $ImageToggleButton {
  checked: boolean;
  color: $ImageToggleButton.Color;
  direction: $ImageToggleButton.Direction;
  disabled: boolean;
  icononly: boolean;
  onChange: (event: CustomEvent<boolean>) => void;
}
export namespace $ImageToggleButton {
  export type Color = "white" | "black";
  export type Direction = "tb" | "lr";
}

export const imageToggleButtonRender = (
  aniConfig: {
    src: string;
    frames: number;
    duration: string;
    checkedColor: string;
  },
  button: $ImageToggleButton,
  slotRender: () => unknown,
) => {
  return (
    <bn-image-toggle-button
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
    </bn-image-toggle-button>
  );
};

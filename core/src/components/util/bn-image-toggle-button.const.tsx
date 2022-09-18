import { FunctionalComponent, h } from "@stencil/core";

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

export const ImageToggleButtonRender: FunctionalComponent<{
  src: string;
  frames: number;
  duration: string;
  checkedColor: string;
  button: $ImageToggleButton;
}> = (props, children) => {
  const { button } = props;
  return (
    <bn-image-toggle-button
      class="icon"
      src={props.src}
      frames={props.frames}
      duration={props.duration}
      checkedColor={props.checkedColor}
      direction={button.direction}
      color={button.color}
      disabled={button.disabled}
      icononly={button.icononly}
      checked={button.checked}
      onCheckedChange={button.onChange}
    >
      {children}
    </bn-image-toggle-button>
  );
};

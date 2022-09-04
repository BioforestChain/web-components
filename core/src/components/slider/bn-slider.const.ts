import { EventEmitter } from "@stencil/core";

//#region Slider

export interface $BnSlider extends $BnSlider.BnSliderBase {
  activedIndexChange: EventEmitter<$BnSlider.ActivedIndexChangeDetail>;
}
export const isBnSlider = (ele: unknown): ele is $BnSlider.HTMLBnSliderElement => {
  return ele instanceof HTMLElement && typeof (ele as any).slideTo === "function";
};
export namespace $BnSlider {
  export interface BnSliderBase {
    getActivedIndex(): Promise<number>;
    slideTo(activedIndex: number): Promise<void>;
    getScrollProgress(): Promise<number>;
    getReason(): Promise<Reason>;
  }
  /**
   * 当前的状态变动的“原因”
   * 如果是 user ，说明是用户在控制，此时应该避免去对它进行任何覆盖操作，避免行为不跟手
   * 如果是 auto ，说明是机器在控制
   */
  export type Reason = "user" | "auto";
  export type ActivedIndexChangeDetail = number; // [sliderEle: HTMLElement | undefined, activedIndex: number];

  export type HTMLBnSliderElementEventMap = HTMLElementEventMap & {
    activedIndexChange: CustomEvent<ActivedIndexChangeDetail>;
    scrollend: Event;
  };
  export interface HTMLBnSliderElement extends HTMLElement, BnSliderBase {
    addEventListener<K extends keyof HTMLBnSliderElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLBnSliderElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLBnSliderElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLBnSliderElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
/**
 * 可以与 slider 元素进行绑定
 * 拥有 forSlider 属性来绑定id
 */
export interface $BnSliderFollower {
  /**通过 `@Prop` 修饰器绑定  */
  forSlider?: string;
  bindSliderElement(ele?: HTMLElement | null): void;
}
//#endregion

//#region Layout

export interface $BnLayout extends $BnLayout.BnLayoutBase {
  layoutChange: EventEmitter<$BnLayout.LayoutChangeDetail>;
}
export const isBnLayout = (ele: unknown): ele is $BnLayout.HTMLBnLayoutElement => {
  return ele instanceof HTMLElement && typeof (ele as any).getLayoutInfo === "function";
};
export const isBnLayoutEqual = (layout1: $BnLayout.LayoutChangeDetail, layout2: $BnLayout.LayoutChangeDetail) => {
  if (layout1 === layout2) {
    return true;
  }
  if (layout1.box.viewSize !== layout2.box.viewSize || layout1.box.scrolledSize !== layout2.box.scrolledSize) {
    return false;
  }
  if (layout1.blockList.length !== layout2.blockList.length) {
    return false;
  }
  if (layout1.blockList.some((block1, index) => layout2.blockList[index].size !== block1.size)) {
    return false;
  }
  return true;
};
export namespace $BnLayout {
  export interface BnLayoutBase {
    getLayoutInfo(): Promise<LayoutChangeDetail>;
  }
  export type LayoutChangeDetail = {
    box: { viewSize: number; contentSize: number; scrolledSize: number };
    blockList: { size: number, start: number }[];
  };
  export type HTMLBnLayoutElementEventMap = HTMLElementEventMap & {
    layoutChange: CustomEvent<LayoutChangeDetail>;
  };
  export interface HTMLBnLayoutElement extends HTMLElement, BnLayoutBase {
    addEventListener<K extends keyof HTMLBnLayoutElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLBnLayoutElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLBnLayoutElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLBnLayoutElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}

/**
 * 可以与 layout 元素进行绑定
 */
export interface $BnLayoutFollower {
  /**通过 `@Prop` 修饰器绑定  */
  forLayout?: string;
  bindLayoutElement(ele?: HTMLElement | null): void;
}
//#endregion

import { EventEmitter } from "@stencil/core";

//#region Slider

export interface $CccSlider extends $CccSlider.CccSliderBase {
  activedIndexChange: EventEmitter<$CccSlider.ActivedIndexChangeDetail>;
}
export const isCccSlider = (ele: unknown): ele is $CccSlider.HTMLCccSliderElement => {
  return ele instanceof HTMLElement && typeof (ele as any).slideTo === "function";
};
export namespace $CccSlider {
  export interface CccSliderBase {
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

  export type HTMLCccSliderElementEventMap = HTMLElementEventMap & {
    activedIndexChange: CustomEvent<ActivedIndexChangeDetail>;
    scrollend: Event;
  };
  export interface HTMLCccSliderElement extends HTMLElement, CccSliderBase {
    addEventListener<K extends keyof HTMLCccSliderElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLCccSliderElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLCccSliderElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLCccSliderElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}
/**
 * 可以与 slider 元素进行绑定
 * 拥有 forSlider 属性来绑定id
 */
export interface $CccSliderFollower {
  /**通过 `@Prop` 修饰器绑定  */
  forSlider?: string;
  bindSliderElement(ele?: HTMLElement | null): void;
}
//#endregion

//#region Layout

export interface $CccLayout extends $CccLayout.CccLayoutBase {
  layoutChange: EventEmitter<$CccLayout.LayoutChangeDetail>;
}
export const isCccLayout = (ele: unknown): ele is $CccLayout.HTMLCccLayoutElement => {
  return ele instanceof HTMLElement && typeof (ele as any).getLayoutInfo === "function";
};
export const isCccLayoutEqual = (layout1: $CccLayout.LayoutChangeDetail, layout2: $CccLayout.LayoutChangeDetail) => {
  if (layout1 === layout2) {
    return true;
  }
  if (layout1.box.viewSize !== layout2.box.viewSize || layout1.box.scrollSize !== layout2.box.scrollSize) {
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
export namespace $CccLayout {
  export interface CccLayoutBase {
    getLayoutInfo(): Promise<LayoutChangeDetail>;
  }
  export type LayoutChangeDetail = {
    box: { viewSize: number; scrollSize: number };
    blockList: { size: number }[];
  };
  export type HTMLCccLayoutElementEventMap = HTMLElementEventMap & {
    layoutChange: CustomEvent<LayoutChangeDetail>;
  };
  export interface HTMLCccLayoutElement extends HTMLElement, CccLayoutBase {
    addEventListener<K extends keyof HTMLCccLayoutElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLCccLayoutElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLCccLayoutElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLCccLayoutElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}

/**
 * 可以与 layout 元素进行绑定
 */
export interface $CccLayoutFollower {
  /**通过 `@Prop` 修饰器绑定  */
  forLayout?: string;
  bindLayoutElement(ele?: HTMLElement | null): void;
}
//#endregion

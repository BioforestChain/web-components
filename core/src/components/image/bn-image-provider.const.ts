import { ImageTransform } from "../../utils/imageProvider";

export namespace $BnImageProvider {
  export interface BnImageAdapterBase {
    getTransfrom(): Promise<ImageTransform>;
    pixelRatio?: number;
  }
  export type BnImageAdapterElementEventMap = HTMLElementEventMap & {};
  export interface HTMLBnImageAdapterElement extends HTMLElement, BnImageAdapterBase {
    addEventListener<K extends keyof BnImageAdapterElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: BnImageAdapterElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof BnImageAdapterElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: BnImageAdapterElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}

import { ImageTransform } from "../../utils/imageProvider.const";

export namespace $BnImageCustomAdapter {
  export interface BnImageCustomAdapterBase {}
  export type CustomTransformDetail = {
    promise(
      executor: (
        cb: (error: unknown, url?: string) => void,
        source_url: string,
        params: { [key: string]: unknown },
        config: { pixelRatio: number },
      ) => unknown,
    ): void;
  };

  export type HTMLBnImageCustomAdapterElementEventMap = HTMLElementEventMap & {
    transform: CustomEvent<CustomTransformDetail>;
  };
  export interface HTMLBnImageCustomAdapterElement extends HTMLElement, BnImageCustomAdapterBase {
    addEventListener<K extends keyof HTMLBnImageCustomAdapterElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLBnImageCustomAdapterElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLBnImageCustomAdapterElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLBnImageCustomAdapterElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}

export class CustomImageTransform extends ImageTransform {
  constructor(readonly ele: $BnImageCustomAdapter.HTMLBnImageCustomAdapterElement) {
    super();
  }
  transform(source_url: string, params: { [key: string]: unknown }, config: { pixelRatio: number }) {
    let promise: Promise<string> | undefined;
    const detail: $BnImageCustomAdapter.CustomTransformDetail = {
      promise: executor => {
        /// 开发者需要立刻执行 promise 函数，来生成 promise 实例
        promise = new Promise((resolve, reject) =>
          executor(
            (error, url) => {
              if (error) {
                reject(error);
              } else {
                resolve(url ?? source_url);
              }
            },
            source_url,
            params,
            config,
          ),
        );
      },
    };
    const transformEvent = new CustomEvent("transform", { detail });
    this.ele.dispatchEvent(transformEvent);

    return promise || source_url;
  }
}

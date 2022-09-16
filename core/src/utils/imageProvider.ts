import { ImageTransform } from "./imageProvider.const";
export * from "./imageProvider.const";

/**
 * 未来可能会支持让 bn-image 选择 provider（通过id绑定）：通过 EventBindingHelper 来让 bn-image 与 Provider 进行联动
 */
class ImageProvider {
  transform(
    source_url: string,
    params: { [key: string]: unknown },
    config: { pixelRatio: number } = { pixelRatio: 1 },
  ) {
    return this._dtf ? this._dtf.transform(source_url, params, config) : source_url;
  }
  transformFromElement(source_url: string, ele: HTMLElement) {
    return this._dtf ? this._dtf.transformFromElement(source_url, ele) : source_url;
  }
  private _rtsMap = new Map<HTMLElement, ImageTransform>();
  private _dtf?: ImageTransform;
  registryTransform(ele: HTMLElement, transform: ImageTransform, as_default = true) {
    this._rtsMap.set(ele, transform);
    if (as_default) {
      this._dtf = transform;
    }
  }
  unregistryTransform(ele: HTMLElement) {
    this._rtsMap.delete(ele);

    this._dtf = undefined;
    for (const tf of this._rtsMap.values()) {
      this._dtf = tf;
    }
  }
  unregistryAllTransform() {
    this._rtsMap.clear();
    this._dtf = undefined;
  }
}

export const imageProvider = new ImageProvider();

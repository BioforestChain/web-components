export abstract class ImageTransform {
  abstract transform(
    source_url: string,
    params: { [key: string]: unknown },
  ): /* dest_url */ string | PromiseLike<string>;
  transformFromElement(source_url: string, ele: HTMLElement) {
    return this.transform(source_url, ele.dataset);
  }
}

class NoImageTransform extends ImageTransform {
  transform(source_url: string) {
    return source_url;
  }
}
export const noImageTransform = new NoImageTransform();

/**
 * 未来可能会支持让 bn-image 选择 provider（通过id绑定）：通过 EventBindingHelper 来让 bn-image 与 Provider 进行联动
 */
class ImageProvider extends ImageTransform {
  transform(source_url: string, params: { [key: string]: unknown }) {
    return this._dtf.transform(source_url, params);
  }
  private _rtsMap = new Map<HTMLElement, ImageTransform>();
  private _dtf: ImageTransform = noImageTransform;
  registryTransform(ele: HTMLElement, transform: ImageTransform) {
    this._rtsMap.set(ele, transform);
    this._dtf = transform;
  }
  unregistryTransform(ele: HTMLElement) {
    this._rtsMap.delete(ele);
    for (const tf of this._rtsMap.values()) {
      this._dtf = tf;
    }
  }
}

export const imageProvider = new ImageProvider();

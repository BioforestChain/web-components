export abstract class ImageTransform {
  abstract transform(
    source_url: string,
    params: { [key: string]: unknown },
    config: { pixelRatio: number },
  ): /* dest_url */ string | PromiseLike<string>;
  transformFromElement(source_url: string, ele: HTMLElement) {
    let parentRect: DOMRect | undefined;
    let eleRect: DOMRect | undefined;
    const params = Object.create(ele.dataset);
    let { width: param_width, height: param_height } = params;
    {
      if (param_width === "parent") {
        const parentWidth = (parentRect ?? ele.parentElement?.getBoundingClientRect())?.width;
        if (parentWidth === undefined || parentWidth === 0) {
          param_width = parentWidth;
        } else {
          param_width = "auto";
        }
      }
      if (param_width === "auto") {
        param_width = String((ele as any).width ?? ((eleRect ??= ele.getBoundingClientRect()).width || screen.width));
      }
      params.width = param_width;
    }
    {
      if (param_height === "parent") {
        const parentHeight = (parentRect ?? ele.parentElement?.getBoundingClientRect())?.height;
        if (parentHeight === undefined || parentHeight === 0) {
          param_height = parentHeight;
        } else {
          param_height = "auto";
        }
      }
      if (param_height === "auto") {
        param_height = String(
          (ele as any).height ?? ((eleRect ??= ele.getBoundingClientRect()).height || screen.height),
        );
      }
      params.height = param_height;
    }
    const config = {
      pixelRatio: devicePixelRatio,
    };
    const pixelRatio = (ele as any).pixelRatio;
    if (typeof pixelRatio === "number") {
      config.pixelRatio = pixelRatio;
    }

    return this.transform(source_url, params, config);
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
  transform(
    source_url: string,
    params: { [key: string]: unknown },
    config: { pixelRatio: number } = { pixelRatio: 1 },
  ) {
    return this._dtf.transform(source_url, params, config);
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

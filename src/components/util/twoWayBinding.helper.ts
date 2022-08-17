import { ComponentInterface } from "@stencil/core";
import { queryScopeSelectorAll } from "../../utils/utils";

/**绑定跟随者的工具类 */
export class BindFollowerHelper<T> implements ComponentInterface {
  constructor(
    readonly hostEle: HTMLElement,
    readonly bindProp: string = "for",
    readonly onBind: (ele: T) => void,
    readonly onUnBind: (ele: T) => void,
  ) {}

  private _id_mob = new MutationObserver(() => {
    this.unbind();
    this.binding();
  });

  private _bindingEles = new Set<T>();
  binding() {
    if (this.hostEle.id) {
      for (const ele of queryScopeSelectorAll<T>(this.hostEle, `[${this.bindProp}=${this.hostEle.id}]`)) {
        if (this._bindingEles.has(ele) === false) {
          this.onBind(ele);
        }
      }
    }
  }
  unbind() {
    for (const ele of this._bindingEles) {
      this.onUnBind(ele);
    }
    this._bindingEles.clear();
  }
  connectedCallback() {
    this._id_mob.observe(this.hostEle, {
      attributeFilter: ["id"],
      attributes: true,
    });
    this.binding();
  }
  disconnectedCallback() {
    this._id_mob.disconnect();
    this.unbind();
  }
}

// export class FollowerHelper<T> implements ComponentInterface {
//   constructor(readonly hostEle: HTMLElement, readonly bindProp: string = "for") {}
// }

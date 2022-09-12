import { multiApply as multiApply, querySelector, querySelectorAll } from "../../utils/utils";

export type $QueryNullCallback<_E> = () => unknown;
export type $QueryOneCallback<E> = (element: E) => unknown;
export type $QueryManyCallback<E> = (elements: E[]) => unknown;
/**
 * An Query Helper Tool for WebComponent-Element, query it shadowRoot
 */
export class QueryHelper<E extends HTMLElement = HTMLElement> {
  constructor(readonly hostEle: HTMLElement, readonly selector: string) {}

  private _found_null_cbs = new Set<$QueryNullCallback<E>>();
  private _found_one_cbs = new Set<$QueryOneCallback<E>>();
  private _found_many_cbs = new Set<$QueryManyCallback<E>>();
  onNoFound(cb: $QueryNullCallback<E>) {
    this._found_null_cbs.add(cb);
    return this;
  }
  onFoundOne(cb: $QueryOneCallback<E>) {
    this._found_one_cbs.add(cb);
    return this;
  }
  onFoundMany(cb: $QueryManyCallback<E>) {
    this._found_many_cbs.add(cb);
    return this;
  }
  doFound() {
    if (this._found_many_cbs.size > 0) {
      const eles = querySelectorAll<E>(this.hostEle.shadowRoot, this.selector);
      const manyRes = multiApply(this._found_many_cbs, [eles]);
      const ele = eles[0];
      if (ele !== undefined) {
        const oneRes = multiApply(this._found_one_cbs, [ele]);
        manyRes.push(oneRes);
      } else {
        const noRes = multiApply(this._found_null_cbs, []);
        manyRes.push(noRes);
      }
      return manyRes;
    } else if (this._found_one_cbs.size > 0) {
      const ele = querySelector<E>(this.hostEle.shadowRoot, this.selector);
      if (ele !== undefined) {
        return multiApply(this._found_one_cbs, [ele]);
      } else {
        return multiApply(this._found_null_cbs, []);
      }
    }
  }
  componentDidLoad() {
    this.doFound();
  }
}

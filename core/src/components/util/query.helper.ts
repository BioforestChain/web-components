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
  private _doFindOne = false;
  private _lastOne?: E;
  private _doFindMany = false;
  private _lastMany?: E[];
  private _findOne() {
    this._doFindOne = true;
    return (this._lastOne = querySelector<E>(this.hostEle.shadowRoot, this.selector));
  }
  private _findMany() {
    this._doFindOne = true;
    this._doFindMany = true;
    const res = (this._lastMany = querySelectorAll<E>(this.hostEle.shadowRoot, this.selector));
    this._lastOne = res[0];
    return res;
  }
  get lastOne() {
    if (this._doFindOne === false) {
      return this._findOne();
    }
    return this._lastOne;
  }
  get lastMany() {
    if (this._doFindMany === false) {
      return this._findMany();
    }
    return this._lastMany;
  }
  doFound() {
    this._doFindOne = false;
    this._doFindMany = false;
    if (this._found_many_cbs.size > 0) {
      const eles = this._findMany();
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
      const ele = this._findOne();
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

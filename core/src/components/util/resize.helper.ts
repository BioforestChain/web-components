import { multiApply } from "../../utils/utils";
export type $ResizeCallback = (entry: ResizeObserverEntry) => unknown;
export type $InitCallback = (entry: ResizeObserverEntry) => unknown;
export class ResizeHelper {
  // private _on_resize_cb = new Set<$ResizeCallback>();
  // private _on_init_cb = new Set<$InitCallback>();
  // onResize(cb: $ResizeCallback) {
  //   this._on_resize_cb.add(cb);
  //   return this;
  // }
  // onInit(cb: $InitCallback) {
  //   this._on_init_cb.add(cb);
  //   return this;
  // }

  private _on_resize_cbs = new Map<Element, Set<$ResizeCallback>>();
  private _on_init_cbs = new Map<Element, Set<$InitCallback>>();
  private _eles = new Set<Element>();
  on(ele: Element, listener: { resize?: $ResizeCallback; init?: $InitCallback }) {
    if (listener.resize) {
      let cbs = this._on_resize_cbs.get(ele);
      if (cbs === undefined) {
        cbs = new Set();
        this._on_resize_cbs.set(ele, cbs);
      }
      cbs.add(listener.resize);
    }
    if (listener.init) {
      let cbs = this._on_init_cbs.get(ele);
      if (cbs === undefined) {
        cbs = new Set();
        this._on_init_cbs.set(ele, cbs);
      }
      cbs.add(listener.init);
    }

    /// observe element
    if (this._eles.has(ele) === false) {
      this._eles.add(ele);
      if (this._observing) {
        this._observeOne(ele);
      }
    }

    return this;
  }
  private _init_states = new Map<Element, { width: number; height: number } | null>();
  private _resizeOb = new ResizeObserver(enties => {
    for (const entry of enties) {
      const ele = entry.target;
      const init_state = this._init_states.get(ele);
      if (
        init_state != undefined &&
        init_state.width === entry.contentRect.width &&
        init_state.height === entry.contentRect.height
      ) {
        this._init_states.set(ele, null);
        const cbs = this._on_init_cbs.get(ele);
        cbs && cbs.size > 0 && multiApply(cbs, [entry]);
      } else {
        const cbs = this._on_resize_cbs.get(ele);
        cbs && cbs.size > 0 && multiApply(cbs, [entry]);
      }
    }
  });

  private _observing = false;

  observe() {
    if (this._observing) {
      return;
    }
    this._observing = true;
    for (const ele of this._eles) {
      this._observeOne(ele);
    }
  }
  private _observeOne(ele: Element) {
    if (this._init_states.get(ele) === undefined) {
      this._init_states.set(ele, ele.getBoundingClientRect());
    }
    this._resizeOb.observe(ele);
  }

  unobserve() {
    if (this._observing === false) {
      return;
    }
    this._observing = false;
    for (const ele of this._eles) {
      this._resizeOb.unobserve(ele);
    }
    this._resizeOb.disconnect();
  }

  componentDidLoad() {
    this.observe();
  }
  disconnectedCallback() {
    this.unobserve();
  }
}

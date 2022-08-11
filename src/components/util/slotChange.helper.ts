import { ComponentInterface } from "@stencil/core";
import { querySelector, throttleWrapper } from "../../utils/utils";

export type $SlotChangeCallback = (elements: Set<HTMLElement>, nodes: Set<Node>) => unknown;

export class SlotChangeHelper implements ComponentInterface {
  constructor(private hostEle: HTMLElement, readonly slot: string) {}

  onChange(cb: $SlotChangeCallback) {
    this._cbs.add(cb);
    return this;
  }
  private _cbs = new Set<$SlotChangeCallback>();
  private _emitCallback(elements: Set<HTMLElement>, nodes: Set<Node>) {
    const runs: PromiseLike<unknown>[] = [];
    for (const cb of this._cbs) {
      try {
        const res = cb(elements, nodes);
        if (res && typeof (res as any).then === "function") {
          runs.push(res as PromiseLike<unknown>);
        }
      } catch (err) {
        runs.push(Promise.reject(err));
      }
    }
    return Promise.all(runs);
  }

  /**
   * 所有的元素，包括slot本身
   */
  private _allNodes = new Set<Node>();
  private _slots = new Set<HTMLSlotElement>();

  private _onSlotChange = throttleWrapper(
    () => {
      this._bind();
    },
    0,
    true,
  );

  componentDidLoad() {
    this._bind();
  }
  disconnectedCallback() {
    for (const slotEle of this._slots) {
      slotEle.removeEventListener("slotchange", this._onSlotChange);
    }
    this._allNodes.clear();
    this._slots.clear();
  }
  private _bind() {
    const allNodes = new Set<Node>();
    const nodes = new Set<Node>();
    const elements = new Set<HTMLElement>();
    const slots = new Set<HTMLSlotElement>();

    /**收集各类DOM元素 */
    const collectNodes = (slotEle: HTMLSlotElement): void => {
      slots.add(slotEle);
      allNodes.add(slotEle);
      for (const node of slotEle.assignedNodes()) {
        if (node instanceof HTMLSlotElement) {
          return collectNodes(node);
        }
        if (node instanceof HTMLElement) {
          elements.add(node);
        }
        nodes.add(node);
        allNodes.add(node);
      }
    };
    const rootSlotEle = querySelector<HTMLSlotElement>(this.hostEle.shadowRoot, `slot[name="${this.slot}"]`);
    if (rootSlotEle) {
      collectNodes(rootSlotEle);
    }
    /// 如果没有变动，那么不需要触发
    if (isSetEqual(allNodes, this._allNodes)) {
      return;
    }

    /// 为新元素绑定事件
    for (const slotEle of slots) {
      /// 已经绑定过了的
      if (this._slots.has(slotEle)) {
        this._slots.delete(slotEle);
        continue;
      }
      //
      slotEle.addEventListener("slotchange", this._onSlotChange);
    }
    /// 为旧元素解绑事件
    for (const slotEle of this._slots) {
      slotEle.removeEventListener("slotchange", this._onSlotChange);
    }
    this._slots = slots;
    this._emitCallback(elements, nodes);
  }
}
const isSetEqual = <T>(a: Set<T>, b: Set<T>) => {
  if (a.size !== b.size) {
    return false;
  }
  for (const item of a) {
    if (b.has(item) === false) {
      return false;
    }
  }
  return true;
};

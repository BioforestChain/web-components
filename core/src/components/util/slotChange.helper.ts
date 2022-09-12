import { ComponentInterface } from "@stencil/core";
import { multiApply, querySelector, throttleWrapper, $Elements, createElements } from "../../utils/utils";

export type $SlotChangeCallback = <T extends HTMLElement = HTMLElement>(
  elements: $Elements<T>,
  nodes: Set<Node>,
) => unknown;
export type $SlotToggleCallback = (hasEle: boolean, rootSlotEle: HTMLSlotElement | undefined) => unknown;

export class SlotChangeHelper implements ComponentInterface {
  constructor(private hostEle: HTMLElement, readonly slot: string) {}

  /**获取Host元素下的slot元素 */
  getHostSlotElement() {
    for (const slotEle of this._slots) {
      return slotEle;
    }
  }

  onChange(cb: $SlotChangeCallback) {
    this._change_cbs.add(cb);
    return this;
  }

  private _isToggle?: boolean;
  onToggle(cb: $SlotToggleCallback) {
    this._toggle_cbs.add(cb);
    return this;
  }

  private _change_cbs = new Set<$SlotChangeCallback>();
  private _toggle_cbs = new Set<$SlotToggleCallback>();
  private _emitCallback(eles: Set<HTMLElement>, nodes: Set<Node>) {
    /// change
    const onChangeRes = multiApply(this._change_cbs, [createElements(eles), nodes]);

    /// toggle
    const hasEle = eles.size > 0;
    if (this._isToggle !== hasEle) {
      this._isToggle = hasEle;
      const rootSlotEle = this.getHostSlotElement();
      const onToggleRes = multiApply(this._toggle_cbs, [hasEle, rootSlotEle]);
      onChangeRes.push(...onToggleRes);
    }
    return onChangeRes.promise;
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

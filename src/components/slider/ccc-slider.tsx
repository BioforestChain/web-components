import { Component, ComponentInterface, Element, h, Host } from "@stencil/core";
import { querySelectorAll } from "../../utils/utils";

@Component({
  tag: "ccc-slider",
  styleUrl: "ccc-slider.scss",
  shadow: true,
})
export class CccSlider implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  get id() {
    return this.hostEle.id;
  }
  // @Watch("id")
  // watchId() {
  //   if (this._inDOM) {
  //     this._unbindTabs();
  //     this._bindingTabs();
  //   }
  // }

  private _tabs: HTMLCccSliderTabsElement[] = [];
  private _bindingTabs() {
    if (this.id) {
      for (const tabsEle of (this._tabs = querySelectorAll<HTMLCccSliderTabsElement>(
        document,
        `ccc-silder-tabs[for=${this.id}]`,
      ))) {
        tabsEle.bindForElement(this.hostEle); // 绑定
      }
    }
  }
  private _unbindTabs() {
    for (const tabsEle of this._tabs) {
      tabsEle.bindForElement(null); // 解绑
    }
  }

  /**
   * watch id changed
   */
  private _attrMuOb = new MutationObserver(() => {
    if (this._inDOM) {
      this._unbindTabs();
      this._bindingTabs();
    }
  });

  private _inDOM = false;
  connectedCallback() {
    this._inDOM = true;
    this._bindingTabs();
    this._attrMuOb.observe(this.hostEle, {
      attributeFilter: ["id"],
      attributes: true,
    });
  }

  disconnectedCallback() {
    this._inDOM = false;
    this._unbindTabs();
    this._attrMuOb.disconnect();
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

import { Component, ComponentInterface, Element, h, Host, Prop, Fragment } from "@stencil/core";

/**
 * 元素堆叠
 * 提前将多个元素渲染堆叠在一起，可以用在一些特效上。
 * 该元素盒子的大小是共享的，从而可以带来很多加速。
 *
 * 比如说将加粗的文本和普通的文本堆叠在一起，最终在切换文本粗细的时候，不会触发resize
 */
@Component({
  tag: "ccc-stacking-util",
  styleUrl: "ccc-stacking-util.scss",
  shadow: true,
})
export class CccStackingUtil implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  @Prop() text?: string;

  render() {
    return (
      <Host>
        <slot name="layer">
          {this.text ? (
            <Fragment>
              <span part="front">{this.text}</span>
              <span part="back">{this.text}</span>
            </Fragment>
          ) : null}
        </slot>
      </Host>
    );
  }
}

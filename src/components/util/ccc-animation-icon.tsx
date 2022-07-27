import { Component, ComponentInterface, Element, h, Host, Method, Prop, Watch } from "@stencil/core";
import { querySelector } from "../../utils/utils";

export type $SpritDirection = "tb" | "bt" | "lr" | "rl";

@Component({
  tag: "ccc-animation-icon",
  styleUrl: "ccc-animation-icon.scss",
  shadow: true,
})
/**
 * 这里要求帧必须是单向的布局，如果有定制化需求，使用part去进行修饰
 * 该组件一般不直接使用
 */
export class CccAnimationIcon implements ComponentInterface {
  /**图片地址 */
  @Prop() src!: string;
  /**帧数 */
  @Prop() frames!: number; // = 1
  /**动画时长 */
  @Prop() duration!: string;
  /**画框宽度 */
  @Prop() width?: string;
  /**画框高度 */
  @Prop() height?: string;
  /**画框比例 */
  @Prop() ratio?: number;
  /**动画步进方向 */
  @Prop() direction: $SpritDirection = "lr";
  /**动画的状态 */
  @Prop({ mutable: true }) actived = false;
  @Watch("actived")
  watchActived() {
    if (this.actived) {
      this.play();
    } else {
      this.reset();
    }
  }
  componentDidLoad() {
    if (this.actived) {
      for (const ani of this.viewboxEle.getAnimations()) {
        ani.finish();
      }
    } else {
      for (const ani of this.viewboxEle.getAnimations()) {
        ani.currentTime = 0;
      }
    }
  }

  @Element() hostEle!: HTMLElement;
  private _viewboxEle?: HTMLDivElement;
  get viewboxEle() {
    return (this._viewboxEle ??= querySelector<HTMLDivElement>(this.hostEle.shadowRoot, `[part="viewbox"]`))!;
  }

  @Method()
  async play() {
    for (const ani of this.viewboxEle.getAnimations()) {
      ani.play();
    }
  }

  @Method()
  async pause() {
    for (const ani of this.viewboxEle.getAnimations()) {
      ani.pause();
    }
  }

  @Method()
  async reset() {
    if (typeof this.viewboxEle.getAnimations !== "function") {
      console.error("需要引入 animation api polyfill");
    }
    for (const ani of this.viewboxEle.getAnimations()) {
      ani.pause();
      ani.currentTime = 0;
    }
  }

  render() {
    const style: {
      [key: string]: string | undefined;
    } = {
      backgroundImage: `url(${this.src})`,
      animationTimingFunction: `steps(${this.frames - 1})`,
    };
    if (this.duration) {
      style.animationDuration = this.duration;
    }
    if (this.width) {
      style["--width"] = this.width;
    }
    if (this.height) {
      style["--height"] = this.height;
    }
    if (this.ratio) {
      style["--ratio"] = this.ratio.toString();
    }
    return (
      <Host>
        <div part="viewbox" class={`img-viewbox ${this.direction}`} style={style}></div>
      </Host>
    );
  }
}

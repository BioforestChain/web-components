import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  Watch,
} from "@stencil/core";
import { Logger } from "../../utils/utils";

// const THRESHOLD_STEPS = 10;
const THRESHOLD = [0, 1]; // Array.from({ length: THRESHOLD_STEPS + 1 }, (_, i) => i / THRESHOLD_STEPS);

/**
 * @slot weakup - 放置唤醒时要渲染的内容
 * @slot sleep - 放置睡眠是要渲染的内容
 */
@Component({
  tag: "ccc-lazy",
  styleUrl: "ccc-lazy.scss",
  shadow: true,
})
export class CccLazy implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  /**
   * 视图进入视野中的时候，唤醒视图
   */
  @Event({ eventName: "weakup" }) onWeakUp!: EventEmitter<void>;
  /**
   * 视图离开视野中的时候，进入睡眠（需要配置 auto-sleep 属性）
   */
  @Event({ eventName: "sleep" }) onSleep!: EventEmitter<void>;

  /**
   * 视图当前的状态
   */
  @Prop({ mutable: true, reflect: true })
  state: "sleep" | "weakup" = "sleep";

  /**
   * 是否自动进入睡眠状态
   */
  @Prop()
  readonly autoSleep: boolean = false;
  @Watch("autoSleep")
  watchAutoSleep() {
    this._initIo();
  }

  private _emitWeakUp() {
    if (this.state === "weakup") {
      return false;
    }
    this.state = "weakup";
    this.onWeakUp.emit();

    /// 如果不是autoSleep，那么可以销毁io对象
    if (this.autoSleep === false) {
      this._destroyIo();
    }
    return true;
  }
  private _emitSleep() {
    if (this.state === "sleep") {
      return false;
    }
    this.state = "sleep";
    this._initIo();
    this.onSleep.emit();
    return true;
  }

  @Method()
  async weakup() {
    return this._emitWeakUp();
  }
  @Method()
  async sleep() {
    return this._emitSleep();
  }

  // @Prop({})
  // readonly forRoot?: string;
  // private _findRoot() {
  //   let root: HTMLElement | undefined | null;
  //   if (this.forRoot) {
  //     root = queryScopeSelector(this.hostEle, this.forRoot);
  //   }
  //   if (root === undefined) {
  //     let parent = this.hostEle.parentElement;
  //     while (parent !== null) {
  //       if (parent.scrollHeight > parent.clientHeight) {
  //         break;
  //       }
  //       parent = parent.parentElement;
  //     }
  //     root = parent || this.hostEle.parentElement;
  //   }
  //   return root || null;
  // }
  private _initIo() {
    if (this._io) {
      return;
    }
    this._createIo();
  }
  private _createIo() {
    this._io = new IntersectionObserver(
      entries => {
        this.console.log(...entries);
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this._emitWeakUp();
          } else if (this.autoSleep) {
            this._emitSleep();
          }
        }
      },
      {
        threshold: THRESHOLD,
        root: this.hostEle.parentElement /*  this._findRoot() */,
        // rootMargin: "0px",
      },
    );
    this._io.observe(this.hostEle);
  }
  private _destroyIo() {
    if (this._io) {
      this._io.unobserve(this.hostEle);
      this._io.disconnect();
      this._io = undefined;
    }
  }

  private _io?: IntersectionObserver;
  connectedCallback() {
    this._initIo();
  }
  disconnectedCallback() {
    this._destroyIo();
  }

  render() {
    return (
      <Host>
        <div part="weakup" class="weakup">
          <slot name="weakup"></slot>
        </div>
        <div part="sleep" class="sleep">
          <slot name="sleep"></slot>
        </div>
      </Host>
    );
  }
}

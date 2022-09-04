import { Component, ComponentInterface, Element, Event, EventEmitter, h, Host, Prop, State } from "@stencil/core";
import { Logger, querySelector } from "../../utils/utils";

@Component({
  tag: "bn-has-more-text",
  styleUrl: "bn-has-more-text.scss",
  shadow: true,
})
export class BnHasMoreText implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);
  @Prop({ reflect: true }) clampLine = 3;
  @Prop() text = "";

  /**
   * visibility state
   * true: open
   * false: hide
   */
  @Event() openChanged!: EventEmitter<boolean>;
  @Prop({ reflect: true, mutable: true })
  open: boolean = false;

  @Prop({ mutable: true })
  lineHeight = 0;

  @State()
  private _has_more = false;
  get hasMore() {
    return this._has_more;
  }

  toggleOpen = () => {
    this.open = !this.open;
  };

  private _updateHasMore() {
    const textContainerEle = this._text_ele!;
    const lineCount = Math.round(textContainerEle.scrollHeight / this.lineHeight);
    this.console.log("lineCount", textContainerEle, textContainerEle.scrollHeight, this.lineHeight, lineCount);
    this._has_more = lineCount > this.clampLine;
  }

  private _resizeOb = new ResizeObserver(entries => {
    for (const entry of entries) {
      if (entry.target === this._has_more_btn_wrapper_ele) {
        this._has_more_btn_height = entry.target.clientHeight;
      } else if (entry.target === this._text_ele) {
        this._updateHasMore();
      } else if (entry.target === this._space_word_ele) {
        this.lineHeight = this._space_word_ele.offsetHeight;
        this._updateHasMore();
      }
    }
  });

  private _text_ele?: HTMLElement;
  private _has_more_btn_wrapper_ele?: HTMLElement;
  /**这个空白字符是用来跟随计算 lineHeight 的，用它的cliengHeight来计算 */
  private _space_word_ele?: HTMLElement;
  @State()
  private _has_more_btn_height = 0;
  componentDidLoad() {
    this._text_ele = querySelector(this.hostEle.shadowRoot, ".text");
    this._resizeOb.observe(this._text_ele!);

    this._has_more_btn_wrapper_ele = querySelector(this.hostEle.shadowRoot, ".has-more-btn-wrapper");
    this._resizeOb.observe(this._has_more_btn_wrapper_ele!);

    this._space_word_ele = querySelector(this.hostEle.shadowRoot, ".space-word");
    this._resizeOb.observe(this._space_word_ele!);
  }
  disconnectedCallback() {
    this._resizeOb.unobserve(this._space_word_ele!);
    this._resizeOb.unobserve(this._has_more_btn_wrapper_ele!);
    this._resizeOb.unobserve(this._text_ele!);
    this._resizeOb.disconnect();
  }

  render() {
    return (
      <Host>
        <span
          class="text"
          part="text"
          style={{
            "--clamp-line": this.clampLine.toString(),
            "--has-more-btn-height": `${this._has_more_btn_height}px`,
            "--line-height": this.lineHeight + "px",
          }}
        >
          <div
            class={{
              "has-more-btn-wrapper": true,
              "show": this._has_more,
            }}
          >
            <span class="dot">{this.open ? "" : "... "}</span>
            <button class="has-more" onClick={this.toggleOpen} part="has-more">
              <span class="unfold btn-text">
                <slot name="unfold">展开</slot>
              </span>
              <span class="fold btn-text">
                <slot name="fold">收起</slot>
              </span>
            </button>
          </div>
          {this.text}
          <span class="space-word"> </span>
        </span>
      </Host>
    );
  }
}

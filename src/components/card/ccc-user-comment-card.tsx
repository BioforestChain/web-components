import { Component, ComponentInterface, Event, EventEmitter, h, Host, Element, Prop, State } from "@stencil/core";
import { Logger, querySelector } from "../../utils/utils";

@Component({
  tag: "ccc-user-comment-card",
  styleUrl: "ccc-user-comment-card.scss",
  shadow: true,
})
export class CccUserCommentCard implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  @Prop() replyContent = "";
  @Prop() userAvator = "";
  @Prop() userName = "some one";
  @Prop() userFlag = "";
  @Prop() time = "some time";
  @Prop() text = "";
  @Prop() lineClamp = 4;
  @Prop() isAuthor: boolean = false;

  @State() canFlod = false;
  @State() isFlod = true;
  toggleFold = () => {
    this.isFlod = !this.isFlod;
  };

  @Event() clickUser!: EventEmitter<void>;

  onClickUser = () => {
    this.clickUser.emit();
  };

  private textContainerEle: HTMLDivElement | null = null;
  private resizeObserver: ResizeObserver | undefined;
  componentDidLoad() {
    const textContainerEle = (this.textContainerEle ??= querySelector<HTMLDivElement>(
      this.hostEle.shadowRoot,
      ".text",
    )!);

    if (this.resizeObserver === undefined) {
      this.resizeObserver = new ResizeObserver(() => {
        this.console.debugger(textContainerEle.scrollHeight, textContainerEle.clientHeight);
        /// 在折叠模式下。可以简单使用 scrollHeight 与 clientHeight 进行配合判断
        if (this.isFlod) {
          this.canFlod = textContainerEle.scrollHeight > textContainerEle.clientHeight;
        }
        /// 在非折叠模式下，需要手动判定函数
        else {
          const style = getComputedStyle(textContainerEle);
          const lh = parseInt(style.lineHeight, 10);
          const h = parseInt(style.height, 10);
          const lineCount = Math.round(h / lh);
          this.canFlod = lineCount > this.lineClamp;
        }
      });
    }
    this.resizeObserver.observe(textContainerEle);
  }
  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  render() {
    return (
      <Host>
        <div class="avator" onClick={this.onClickUser}>
          <slot name="avator">
            <img src={this.userAvator} alt="avator" />
          </slot>
        </div>
        <div class="comment">
          <slot name="header">
            <div class="header">
              <div class="user" onClick={this.onClickUser}>
                <span class="name">
                  <slot name="username">{this.userName}</slot>
                </span>
                {this.isAuthor ? (
                  <span class="author">
                    <slot name="author">楼主</slot>
                  </span>
                ) : undefined}
                <span class="flag">
                  <slot name="userflag">
                    <span class="flag-badge">{this.userFlag}</span>
                  </slot>
                </span>
              </div>
              <span class="time">
                <slot name="time">{this.time}</slot>
              </span>
            </div>
          </slot>
          {this.replyContent.length > 0 ? (
            <div class="text-wrapper gray" style={{ "--line-clamp": `1` }}>
              <div class="text fold ">
                <slot name="replyComment">{this.replyContent}</slot>
              </div>
            </div>
          ) : undefined}
          <div class="text-wrapper" style={{ "--line-clamp": `${this.lineClamp}` }}>
            <div class={{ text: true, fold: this.isFlod }}>
              <slot name="text">{this.text}</slot>
            </div>
          </div>
          {this.canFlod ? (
            <button class={{ "fold-btn": true, "fold": this.isFlod }} onClick={this.toggleFold}>
              {this.isFlod ? <slot name="unfold">展开</slot> : <slot name="fold">收起</slot>}
            </button>
          ) : undefined}
          <div class="actions-bar" part="actionsBar">
            <div class="actions">
              <div class="left-actions">
                <slot name="reply" />
              </div>
              <div class="right-actions" part="rightActions">
                <slot name="actions" />
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

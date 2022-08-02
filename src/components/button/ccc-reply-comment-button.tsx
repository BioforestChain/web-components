import { Component, ComponentInterface, Event, EventEmitter, h, Host, Prop } from "@stencil/core";

@Component({
  tag: "ccc-reply-comment-button",
  styleUrl: "ccc-reply-comment-button.scss",
  shadow: true,
})
export class CccReplyCommentButton implements ComponentInterface {
  /**
   * click count
   */
  @Prop({ reflect: true, mutable: true }) count = 0;
  @Event() countChanged!: EventEmitter<number>;

  render() {
    return (
      <Host>
          <div class="reply-button">
            <span>15</span>
            <span class="reply">回复</span>
            <ion-icon src="./assets/icon/comments_list_right.svg"></ion-icon>
          </div>
      </Host>
    );
  }
}

import { Component, ComponentInterface, EventEmitter, h, Event, Prop } from "@stencil/core";

@Component({
  tag: "ccc-reply-comment-button",
  styleUrl: "ccc-reply-comment-button.scss",
  shadow: true,
})
export class CccReplyCommentButton implements ComponentInterface {
  /**评论数 */
  @Prop() replyNum = 0;
  /**该条评论的id */
  @Prop() commentId = "";

  @Event() userClick!: EventEmitter;
  userClickHandle(commentId: string) {
    // console.log("世界-v", commentId);
    this.userClick.emit({commentId});
  }
  render() {
    return (
      <button class="reply-button" onClick={_=>this.userClickHandle(this.commentId)}>
        <span class="reply-num">{this.replyNum !== 0 ? this.replyNum : ""}</span>
        <span class="reply">回复</span>
        <ion-icon src="./assets/icon/comments_list_right.svg"></ion-icon>
      </button>
    );
  }
}

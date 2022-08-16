import { Component, ComponentInterface, EventEmitter, h, Event, Prop } from "@stencil/core";

@Component({
  tag: "ccc-reply-comment-button",
  styleUrl: "ccc-reply-comment-button.scss",
  shadow: true,
})
export class CccReplyCommentButton implements ComponentInterface {
  /**
   * 该条评论的所有相关信息
   * 这里需要把整个item传入是因为下个页面需要展示这条评论，所以干脆把整个item都传进来
   */
  @Prop() commentInfo: any = {};

  @Event() userClick!: EventEmitter;
  userClickHandle(commentInfo: any) {
    // this.logger.log("世界-v", commentInfo);
    this.userClick.emit(commentInfo);
  }
  render() {
    return (
      <button class="reply-button" part="replyButton" onClick={_ => this.userClickHandle(this.commentInfo)}>
        <span class="reply"> {this.commentInfo?.replies && this.commentInfo?.replies !== 0 ? this.commentInfo?.replies : ""} 回复</span>
        <ion-icon src="./assets/icon/comments_list_right.svg"></ion-icon>
      </button>
    );
  }
}

import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccUserCommentCardKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccUserCommentCard>()
    .defineNumber("lineClamp", {
      defaultValue: 4,
      description: "",
      required: false,
    })
    .defineString("text", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineString("time", {
      defaultValue: "some time",
      description: "",
      required: false,
    })
    .defineString("userAvator", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineString("userFlag", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineString("userName", {
      defaultValue: "some one",
      description: "",
      required: false,
    })
    .defineAction("onClickUser", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccUserCommentCard>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccUserCommentCard>,
  ) => {
    return defineStory<JSX.CccUserCommentCard>(args => {
      return html`<ccc-user-comment-card
        .lineClamp=${args.lineClamp}
        .text=${args.text}
        .time=${args.time}
        .userAvator=${args.userAvator}
        .userFlag=${args.userFlag}
        .userName=${args.userName}
        @clickUser=${args.onClickUser}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-user-comment-card>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccUserCommentCard> };
})();

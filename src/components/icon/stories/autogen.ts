import { html, HTMLTemplateResult } from "lit-html";
import type { JSX } from "../../../components";
import { ArgFactory, defineStory } from "../../../stories/util";

export const cccIconKit = (() => {
  const argsFactory = new ArgFactory<JSX.CccIcon>()
    .defineEnum("direction", ["lr", "tb"], {
      defaultValue: "lr",
      description: "",
      required: false,
    })
    .defineString("label", {
      defaultValue: "",
      description: "",
      required: false,
    })
    .defineEnum(
      "name",
      [
        "ico_address_eye_on",
        "ico_address_eye_off",
        "listicon_views_normal",
        "ico_checkbox_small_on",
        "check",
        "gallery_chekmark_checked",
        "answer_correct",
        "nav_cancel",
        "ico_image_small_delete",
        "ico_label_small_cancel",
        "inputbar_cancel",
        "ico_airdrop_dialog_cancel",
        "me_released",
        "ico_label_small_add",
        "ico_status_small_nontradable",
        "tab_indicator_small_blue",
        "toolbar_boldtext",
        "toolbar_bulletedlist",
        "toolbar_header",
        "toolbar_image",
        "toolbar_italic",
        "toolbar_link",
        "toolbar_numberedlist",
        "toolbar_preview",
        "toolbar_quote",
        "ico_dpdetails_currency",
        "me_profit",
        "big-currency",
        "ico_assets_small_currency",
        "diamond",
        "circle-diamond",
        "ico_mark_angle_assets",
        "ico_navigationbar_circle_share",
        "share",
        "me_refresh",
        "secondarybar_folded",
        "ico_secondarybar_retract",
        "ent_arrow_bg",
        "ico_dpdetails_event_down",
        "ico_payment_download",
        "ico_myevent_small_arrow",
        "ico_navigationbar_backward",
        "ico_navigationbar_circle_arrow",
        "ico_me_exchange",
        "ico_me_switch",
        "guidance_bubble_down",
        "guidance_bubble_left",
        "guidance_bubble_right",
        "guidance_bubble_up",
        "list_row_right",
        "settings_list_folded",
        "settings_list_unfolded",
        "me_wallet",
        "ico_navigationbar_mynft",
        "ico_book_nor",
        "me_dpmanagement",
        "me_collectcode",
        "me_servers",
        "me_ranking",
        "me_paycode",
        "ico_dpdetails_gift",
        "me_invitedgift",
        "me_draft",
        "me_checkin",
        "me_datacenter",
        "nav_settings",
        "nav-historical-exchange",
        "nav_history",
        "me_bell",
        "me_myevent",
        "searchbar_search",
        "nav_search",
        "collection",
        "nav_more",
        "ico_secondarybar_filter",
        "ico_secondarybar_alllabel",
        "ico_secondarybar_display_tile",
        "ico_inputbar_scanning",
        "nav_delete",
        "comment",
        "like",
        "dislike",
        "personalinfo_camera",
        "logo_tanyuanyu",
        "gallery_image_error_bg",
        "ico_dpdetails_comment",
        "ico_payment_qrcode",
        "ico_dpdetails_auction",
        "chat-img-surface",
        "chat-img",
        "icon_chat_sending",
        "ico_dpdetails_validity",
        "avatra_default",
        "history",
        "ico_secondarybar_historicalstate",
        "chat-face-surface",
        "chat-face",
        "ico_me_bfchaintracker",
        "ico_transfer_edit",
        "ico_video_medium_play",
        "ico_transfer_accountaddress",
        "article_contentreview_tips",
        "ico_dpdetails_small_questionmark",
        "ico_publisher_artcles",
        "ico_publisher_assets",
        "ico_publisher_posts",
        "ent_issue_icon",
        "real_name_wait",
        "small-down",
        "paper-plane",
        "cancel",
        "link",
        "warning",
        "eye",
        "ico_status_small_notstarted",
      ],
      {
        defaultValue: undefined,
        description: "",
        required: true,
      },
    )
    .defineBoolean("thin", {
      defaultValue: false,
      description: "",
      required: false,
    })
    .defineAction("onCountChanged", {
      description: "",
    });

  const storyFactory = (
    slot: (args: Partial<Partial<JSX.CccIcon>>) => HTMLTemplateResult,
    args?: Partial<JSX.CccIcon>,
  ) => {
    return defineStory<JSX.CccIcon>(args => {
      return html`<ccc-icon
        .direction=${args.direction}
        .label=${args.label}
        .name=${args.name}
        ?thin=${args.thin}
        @countChanged=${args.onCountChanged}
      >
        <!-- custom child elements -->
        ${slot(args)}
      </ccc-icon>`;
    }, argsFactory.toArgs(args));
  };
  return { argsFactory, storyFactory, $Args: {} as Partial<JSX.CccIcon> };
})();

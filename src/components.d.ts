/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { $SpritDirection } from "./components/util/ccc-animation-icon";
import { $Color, $Direction } from "./components/util/ccc-image-toggle-button.const";
import { $Direction as $Direction1, $IconName } from "./components/icon/ccc-icon.const";
import { AnimationItem, RendererType } from "lottie-web";
import { $Direction as $Direction2 } from "./components/util/ccc-lottie-web-toggle-button.const";
export namespace Components {
    interface CccAnimationIcon {
        /**
          * 动画的状态
         */
        "actived": boolean;
        /**
          * 动画步进方向
         */
        "direction": $SpritDirection;
        /**
          * 动画时长
         */
        "duration": string;
        /**
          * 帧数
         */
        "frames": number;
        /**
          * 画框高度
         */
        "height"?: string;
        "pause": () => Promise<void>;
        "play": () => Promise<void>;
        /**
          * 画框比例
         */
        "ratio"?: number;
        "reset": () => Promise<void>;
        /**
          * 图片地址
         */
        "src": string;
        /**
          * 画框宽度
         */
        "width"?: string;
    }
    interface CccCollectButton {
        "checkLabel": string;
        "checked": boolean;
        "color": $Color;
        "direction": $Direction;
        "disabled": boolean;
        "icononly": boolean;
        "unCheckLabel": string;
    }
    interface CccConfigUtil {
        /**
          * click count
         */
        "assetPath"?: string;
        "getAssetPath": (path?: string) => Promise<string>;
        "setAssetPath": (path: string) => Promise<void>;
    }
    interface CccDislikeButton {
        "checked": boolean;
        "color": $Color;
        "count": number;
        "direction": $Direction;
        "disabled": boolean;
        "icononly": boolean;
    }
    interface CccIcon {
        "direction": $Direction;
        "label": string;
        "name": $IconName;
    }
    interface CccImageToggleButton {
        "checked": boolean;
        "checkedColor": string;
        "color": $Color;
        "direction": $Direction;
        "disabled": boolean;
        "duration": string;
        "frames": number;
        "icononly": boolean;
        "label": string;
        "src": string;
    }
    interface CccLikeButton {
        "checked": boolean;
        "color": $Color;
        "count": number;
        "direction": $Direction;
        "disabled": boolean;
        "icononly": boolean;
    }
    interface CccLottieWeb {
        /**
          * 是否要将动画至于末尾帧？
         */
        "actived": boolean;
        "autoplay": boolean;
        "data": object | undefined;
        "defaultActivedColor": string;
        "direction": 1 | -1;
        "getDuration": (isFrame?: boolean | undefined) => Promise<number | undefined>;
        "getInstance": () => Promise<AnimationItem | undefined>;
        "getPrimaryColor": () => Promise<string>;
        "goToAndPlay": (value: number, isFrame?: boolean | undefined, name?: string | undefined) => Promise<void | undefined>;
        "goToAndStop": (value: number, isFrame?: boolean | undefined, name?: string | undefined) => Promise<void | undefined>;
        "loop": boolean;
        "name": string;
        "pause": (name?: string | undefined) => Promise<void | undefined>;
        "play": (name?: string | undefined) => Promise<void | undefined>;
        /**
          * 渲染类型
         */
        "renderer": RendererType;
        "src": string | undefined;
        "togglePause": (name?: string | undefined) => Promise<void | undefined>;
    }
    interface CccLottieWebToggleButton {
        "animationData": object | undefined;
        "checked": boolean;
        "direction": $Direction;
        "disabled": boolean;
        "icononly": boolean;
        "label": string;
        "labelColor": string;
        "name": string;
    }
    interface CccTemplate {
        /**
          * click count
         */
        "count": number;
        /**
          * inc methid
         */
        "inc": () => Promise<void>;
    }
    interface CccUserCommentCard {
        "lineClamp": number;
        "text": string;
        "time": string;
        "userAvator": string;
        "userFlag": string;
        "userName": string;
    }
}
export interface CccIconCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCccIconElement;
}
export interface CccImageToggleButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCccImageToggleButtonElement;
}
export interface CccLottieWebCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCccLottieWebElement;
}
export interface CccLottieWebToggleButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCccLottieWebToggleButtonElement;
}
export interface CccTemplateCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCccTemplateElement;
}
export interface CccUserCommentCardCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCccUserCommentCardElement;
}
declare global {
    interface HTMLCccAnimationIconElement extends Components.CccAnimationIcon, HTMLStencilElement {
    }
    var HTMLCccAnimationIconElement: {
        prototype: HTMLCccAnimationIconElement;
        new (): HTMLCccAnimationIconElement;
    };
    interface HTMLCccCollectButtonElement extends Components.CccCollectButton, HTMLStencilElement {
    }
    var HTMLCccCollectButtonElement: {
        prototype: HTMLCccCollectButtonElement;
        new (): HTMLCccCollectButtonElement;
    };
    interface HTMLCccConfigUtilElement extends Components.CccConfigUtil, HTMLStencilElement {
    }
    var HTMLCccConfigUtilElement: {
        prototype: HTMLCccConfigUtilElement;
        new (): HTMLCccConfigUtilElement;
    };
    interface HTMLCccDislikeButtonElement extends Components.CccDislikeButton, HTMLStencilElement {
    }
    var HTMLCccDislikeButtonElement: {
        prototype: HTMLCccDislikeButtonElement;
        new (): HTMLCccDislikeButtonElement;
    };
    interface HTMLCccIconElement extends Components.CccIcon, HTMLStencilElement {
    }
    var HTMLCccIconElement: {
        prototype: HTMLCccIconElement;
        new (): HTMLCccIconElement;
    };
    interface HTMLCccImageToggleButtonElement extends Components.CccImageToggleButton, HTMLStencilElement {
    }
    var HTMLCccImageToggleButtonElement: {
        prototype: HTMLCccImageToggleButtonElement;
        new (): HTMLCccImageToggleButtonElement;
    };
    interface HTMLCccLikeButtonElement extends Components.CccLikeButton, HTMLStencilElement {
    }
    var HTMLCccLikeButtonElement: {
        prototype: HTMLCccLikeButtonElement;
        new (): HTMLCccLikeButtonElement;
    };
    interface HTMLCccLottieWebElement extends Components.CccLottieWeb, HTMLStencilElement {
    }
    var HTMLCccLottieWebElement: {
        prototype: HTMLCccLottieWebElement;
        new (): HTMLCccLottieWebElement;
    };
    interface HTMLCccLottieWebToggleButtonElement extends Components.CccLottieWebToggleButton, HTMLStencilElement {
    }
    var HTMLCccLottieWebToggleButtonElement: {
        prototype: HTMLCccLottieWebToggleButtonElement;
        new (): HTMLCccLottieWebToggleButtonElement;
    };
    interface HTMLCccTemplateElement extends Components.CccTemplate, HTMLStencilElement {
    }
    var HTMLCccTemplateElement: {
        prototype: HTMLCccTemplateElement;
        new (): HTMLCccTemplateElement;
    };
    interface HTMLCccUserCommentCardElement extends Components.CccUserCommentCard, HTMLStencilElement {
    }
    var HTMLCccUserCommentCardElement: {
        prototype: HTMLCccUserCommentCardElement;
        new (): HTMLCccUserCommentCardElement;
    };
    interface HTMLElementTagNameMap {
        "ccc-animation-icon": HTMLCccAnimationIconElement;
        "ccc-collect-button": HTMLCccCollectButtonElement;
        "ccc-config-util": HTMLCccConfigUtilElement;
        "ccc-dislike-button": HTMLCccDislikeButtonElement;
        "ccc-icon": HTMLCccIconElement;
        "ccc-image-toggle-button": HTMLCccImageToggleButtonElement;
        "ccc-like-button": HTMLCccLikeButtonElement;
        "ccc-lottie-web": HTMLCccLottieWebElement;
        "ccc-lottie-web-toggle-button": HTMLCccLottieWebToggleButtonElement;
        "ccc-template": HTMLCccTemplateElement;
        "ccc-user-comment-card": HTMLCccUserCommentCardElement;
    }
}
declare namespace LocalJSX {
    interface CccAnimationIcon {
        /**
          * 动画的状态
         */
        "actived"?: boolean;
        /**
          * 动画步进方向
         */
        "direction"?: $SpritDirection;
        /**
          * 动画时长
         */
        "duration": string;
        /**
          * 帧数
         */
        "frames": number;
        /**
          * 画框高度
         */
        "height"?: string;
        /**
          * 画框比例
         */
        "ratio"?: number;
        /**
          * 图片地址
         */
        "src": string;
        /**
          * 画框宽度
         */
        "width"?: string;
    }
    interface CccCollectButton {
        "checkLabel"?: string;
        "checked"?: boolean;
        "color"?: $Color;
        "direction"?: $Direction;
        "disabled"?: boolean;
        "icononly"?: boolean;
        "unCheckLabel"?: string;
    }
    interface CccConfigUtil {
        /**
          * click count
         */
        "assetPath"?: string;
    }
    interface CccDislikeButton {
        "checked"?: boolean;
        "color"?: $Color;
        "count"?: number;
        "direction"?: $Direction;
        "disabled"?: boolean;
        "icononly"?: boolean;
    }
    interface CccIcon {
        "direction"?: $Direction;
        "label"?: string;
        "name": $IconName;
        "onCountChanged"?: (event: CccIconCustomEvent<number>) => void;
    }
    interface CccImageToggleButton {
        "checked"?: boolean;
        "checkedColor"?: string;
        "color"?: $Color;
        "direction"?: $Direction;
        "disabled"?: boolean;
        "duration": string;
        "frames": number;
        "icononly"?: boolean;
        "label"?: string;
        "onCheckedChange"?: (event: CccImageToggleButtonCustomEvent<boolean>) => void;
        "src": string;
    }
    interface CccLikeButton {
        "checked"?: boolean;
        "color"?: $Color;
        "count"?: number;
        "direction"?: $Direction;
        "disabled"?: boolean;
        "icononly"?: boolean;
    }
    interface CccLottieWeb {
        /**
          * 是否要将动画至于末尾帧？
         */
        "actived"?: boolean;
        "autoplay"?: boolean;
        "data"?: object | undefined;
        "defaultActivedColor"?: string;
        "direction"?: 1 | -1;
        "loop"?: boolean;
        "name"?: string;
        "onCountChanged"?: (event: CccLottieWebCustomEvent<number>) => void;
        "onDefaultActivedColorChange"?: (event: CccLottieWebCustomEvent<string>) => void;
        "onEndFrame"?: (event: CccLottieWebCustomEvent<void>) => void;
        "onStartFrame"?: (event: CccLottieWebCustomEvent<void>) => void;
        /**
          * 渲染类型
         */
        "renderer"?: RendererType;
        "src"?: string | undefined;
    }
    interface CccLottieWebToggleButton {
        "animationData"?: object | undefined;
        "checked"?: boolean;
        "direction"?: $Direction;
        "disabled"?: boolean;
        "icononly"?: boolean;
        "label"?: string;
        "labelColor"?: string;
        "name"?: string;
        "onCheckedChange"?: (event: CccLottieWebToggleButtonCustomEvent<boolean>) => void;
    }
    interface CccTemplate {
        /**
          * click count
         */
        "count"?: number;
        "onCountChanged"?: (event: CccTemplateCustomEvent<number>) => void;
    }
    interface CccUserCommentCard {
        "lineClamp"?: number;
        "onClickUser"?: (event: CccUserCommentCardCustomEvent<void>) => void;
        "text"?: string;
        "time"?: string;
        "userAvator"?: string;
        "userFlag"?: string;
        "userName"?: string;
    }
    interface IntrinsicElements {
        "ccc-animation-icon": CccAnimationIcon;
        "ccc-collect-button": CccCollectButton;
        "ccc-config-util": CccConfigUtil;
        "ccc-dislike-button": CccDislikeButton;
        "ccc-icon": CccIcon;
        "ccc-image-toggle-button": CccImageToggleButton;
        "ccc-like-button": CccLikeButton;
        "ccc-lottie-web": CccLottieWeb;
        "ccc-lottie-web-toggle-button": CccLottieWebToggleButton;
        "ccc-template": CccTemplate;
        "ccc-user-comment-card": CccUserCommentCard;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ccc-animation-icon": LocalJSX.CccAnimationIcon & JSXBase.HTMLAttributes<HTMLCccAnimationIconElement>;
            "ccc-collect-button": LocalJSX.CccCollectButton & JSXBase.HTMLAttributes<HTMLCccCollectButtonElement>;
            "ccc-config-util": LocalJSX.CccConfigUtil & JSXBase.HTMLAttributes<HTMLCccConfigUtilElement>;
            "ccc-dislike-button": LocalJSX.CccDislikeButton & JSXBase.HTMLAttributes<HTMLCccDislikeButtonElement>;
            "ccc-icon": LocalJSX.CccIcon & JSXBase.HTMLAttributes<HTMLCccIconElement>;
            "ccc-image-toggle-button": LocalJSX.CccImageToggleButton & JSXBase.HTMLAttributes<HTMLCccImageToggleButtonElement>;
            "ccc-like-button": LocalJSX.CccLikeButton & JSXBase.HTMLAttributes<HTMLCccLikeButtonElement>;
            "ccc-lottie-web": LocalJSX.CccLottieWeb & JSXBase.HTMLAttributes<HTMLCccLottieWebElement>;
            "ccc-lottie-web-toggle-button": LocalJSX.CccLottieWebToggleButton & JSXBase.HTMLAttributes<HTMLCccLottieWebToggleButtonElement>;
            "ccc-template": LocalJSX.CccTemplate & JSXBase.HTMLAttributes<HTMLCccTemplateElement>;
            "ccc-user-comment-card": LocalJSX.CccUserCommentCard & JSXBase.HTMLAttributes<HTMLCccUserCommentCardElement>;
        }
    }
}

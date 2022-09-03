/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@ccchain/web-component';




export declare interface CccAnimationIcon extends Components.CccAnimationIcon {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['actived', 'direction', 'duration', 'frames', 'height', 'ratio', 'src', 'width'],
  methods: ['play', 'pause', 'finish', 'reset']
})
@Component({
  selector: 'ccc-animation-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['actived', 'direction', 'duration', 'frames', 'height', 'ratio', 'src', 'width']
})
export class CccAnimationIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccCollectButton extends Components.CccCollectButton {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checkLabel', 'checked', 'color', 'direction', 'disabled', 'icononly', 'unCheckLabel']
})
@Component({
  selector: 'ccc-collect-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checkLabel', 'checked', 'color', 'direction', 'disabled', 'icononly', 'unCheckLabel']
})
export class CccCollectButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccConfigUtil extends Components.CccConfigUtil {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['assetPath'],
  methods: ['setAssetPath', 'getAssetPath']
})
@Component({
  selector: 'ccc-config-util',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['assetPath']
})
export class CccConfigUtil {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccDislikeButton extends Components.CccDislikeButton {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checked', 'color', 'count', 'direction', 'disabled', 'icononly']
})
@Component({
  selector: 'ccc-dislike-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'color', 'count', 'direction', 'disabled', 'icononly']
})
export class CccDislikeButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccHasMoreText extends Components.CccHasMoreText {
  /**
   * visibility state
true: open
false: hide 
   */
  openChanged: EventEmitter<CustomEvent<boolean>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['clampLine', 'lineHeight', 'open', 'text']
})
@Component({
  selector: 'ccc-has-more-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['clampLine', 'lineHeight', 'open', 'text']
})
export class CccHasMoreText {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['openChanged']);
  }
}


export declare interface CccIcon extends Components.CccIcon {
  /**
   *  
   */
  countChanged: EventEmitter<CustomEvent<number>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['direction', 'label', 'name', 'thin']
})
@Component({
  selector: 'ccc-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['direction', 'label', 'name', 'thin']
})
export class CccIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['countChanged']);
  }
}


export declare interface CccImageToggleButton extends Components.CccImageToggleButton {
  /**
   *  
   */
  checkedChange: EventEmitter<CustomEvent<boolean>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checked', 'checkedColor', 'color', 'direction', 'disabled', 'duration', 'frames', 'icononly', 'label', 'src']
})
@Component({
  selector: 'ccc-image-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'checkedColor', 'color', 'direction', 'disabled', 'duration', 'frames', 'icononly', 'label', 'src']
})
export class CccImageToggleButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['checkedChange']);
  }
}

import type { $LazyState as ICccLazy$LazyState } from '@ccchain/web-component';
export declare interface CccLazy extends Components.CccLazy {
  /**
   * 元素进入视野中的时候，唤醒视图
元素离开视野中的时候，进入睡眠（需要配置 auto-sleep 属性） 
   */
  lazyStateChange: EventEmitter<CustomEvent<ICccLazy$LazyState>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['autoSleep', 'debounce', 'lazyState'],
  methods: ['weakup', 'sleep']
})
@Component({
  selector: 'ccc-lazy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoSleep', 'debounce', 'lazyState']
})
export class CccLazy {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['lazyStateChange']);
  }
}


export declare interface CccLikeButton extends Components.CccLikeButton {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checked', 'color', 'count', 'direction', 'disabled', 'icononly']
})
@Component({
  selector: 'ccc-like-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'color', 'count', 'direction', 'disabled', 'icononly']
})
export class CccLikeButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccLottieWeb extends Components.CccLottieWeb {
  /**
   *  
   */
  defaultActivedColorChange: EventEmitter<CustomEvent<string>>;
  /**
   *  
   */
  startFrame: EventEmitter<CustomEvent<void>>;
  /**
   *  
   */
  endFrame: EventEmitter<CustomEvent<void>>;
  /**
   *  
   */
  countChanged: EventEmitter<CustomEvent<number>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['actived', 'autoplay', 'data', 'defaultActivedColor', 'direction', 'loop', 'name', 'renderer', 'src'],
  methods: ['getInstance', 'play', 'pause', 'togglePause', 'goToAndPlay', 'goToAndStop', 'getDuration', 'getPrimaryColor']
})
@Component({
  selector: 'ccc-lottie-web',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['actived', 'autoplay', 'data', 'defaultActivedColor', 'direction', 'loop', 'name', 'renderer', 'src']
})
export class CccLottieWeb {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['defaultActivedColorChange', 'startFrame', 'endFrame', 'countChanged']);
  }
}


export declare interface CccLottieWebToggleButton extends Components.CccLottieWebToggleButton {
  /**
   *  
   */
  checkedChange: EventEmitter<CustomEvent<boolean>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['animationData', 'checked', 'direction', 'disabled', 'icononly', 'label', 'labelColor', 'name']
})
@Component({
  selector: 'ccc-lottie-web-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['animationData', 'checked', 'direction', 'disabled', 'icononly', 'label', 'labelColor', 'name']
})
export class CccLottieWebToggleButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['checkedChange']);
  }
}


export declare interface CccPictureModelViewer extends Components.CccPictureModelViewer {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['alt', 'gltfSrc', 'skyboxImage', 'src']
})
@Component({
  selector: 'ccc-picture-model-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alt', 'gltfSrc', 'skyboxImage', 'src']
})
export class CccPictureModelViewer {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccReplyCommentButton extends Components.CccReplyCommentButton {
  /**
   *  
   */
  userClick: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['commentInfo']
})
@Component({
  selector: 'ccc-reply-comment-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['commentInfo']
})
export class CccReplyCommentButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['userClick']);
  }
}

import type { $CccSlider as ICccSlider$CccSlider } from '@ccchain/web-component';
export declare interface CccSlider extends Components.CccSlider {
  /**
   * 在初始化的时候，只要有元素，那么它总会触发 
   */
  activedSliderChange: EventEmitter<CustomEvent<[sliderEle: HTMLElement | undefined, index: number]>>;
  /**
   *  
   */
  activedIndexChange: EventEmitter<CustomEvent<ICccSlider$CccSlider.ActivedIndexChangeDetail>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['activedIndex', 'defaultActivedIndex'],
  methods: ['getLayoutInfo', 'getScrollProgress', 'getActivedIndex', 'slideTo', 'update', 'getReason']
})
@Component({
  selector: 'ccc-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activedIndex', 'defaultActivedIndex']
})
export class CccSlider {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['activedSliderChange', 'activedIndexChange']);
  }
}


export declare interface CccSliderScrollbar extends Components.CccSliderScrollbar {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['duration', 'forLayout', 'forSlider'],
  methods: ['bindSliderElement', 'bindLayoutElement', 'update']
})
@Component({
  selector: 'ccc-slider-scrollbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['duration', 'forLayout', 'forSlider']
})
export class CccSliderScrollbar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { $CccLayout as ICccSliderTabs$CccLayout } from '@ccchain/web-component';
export declare interface CccSliderTabs extends Components.CccSliderTabs {
  /**
   * 提供基础的布局信息，虽然自己不用，但是方便外部开发相关的组件 
   */
  layoutChange: EventEmitter<CustomEvent<ICccSliderTabs$CccLayout.LayoutChangeDetail>>;
  /**
   *  
   */
  activedTabChange: EventEmitter<CustomEvent<[tabEle: HTMLElement | undefined, index: number]>>;
  /**
   *  
   */
  activedIndexChange: EventEmitter<CustomEvent<number>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['activedIndex', 'defaultActivedIndex', 'forSlider', 'forTabs'],
  methods: ['bindSliderElement', 'getLayoutInfo', 'slideTo', 'getScrollProgress', 'getActivedIndex', 'getReason']
})
@Component({
  selector: 'ccc-slider-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activedIndex', 'defaultActivedIndex', 'forSlider', 'forTabs']
})
export class CccSliderTabs {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['layoutChange', 'activedTabChange', 'activedIndexChange']);
  }
}


export declare interface CccStackingUtil extends Components.CccStackingUtil {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['text']
})
@Component({
  selector: 'ccc-stacking-util',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['text']
})
export class CccStackingUtil {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccSubTabsMenu extends Components.CccSubTabsMenu {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['forSlider'],
  methods: ['bindSliderElement']
})
@Component({
  selector: 'ccc-sub-tabs-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['forSlider']
})
export class CccSubTabsMenu {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccTemplate extends Components.CccTemplate {
  /**
   *  
   */
  countChanged: EventEmitter<CustomEvent<number>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['count'],
  methods: ['inc']
})
@Component({
  selector: 'ccc-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['count']
})
export class CccTemplate {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['countChanged']);
  }
}


export declare interface CccTopTabsMenu extends Components.CccTopTabsMenu {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['forSlider'],
  methods: ['bindSliderElement']
})
@Component({
  selector: 'ccc-top-tabs-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['forSlider']
})
export class CccTopTabsMenu {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface CccUserCommentCard extends Components.CccUserCommentCard {
  /**
   *  
   */
  clickUser: EventEmitter<CustomEvent<void>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['isAuthor', 'lineClamp', 'replyContent', 'text', 'time', 'userAvator', 'userFlag', 'userName']
})
@Component({
  selector: 'ccc-user-comment-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['isAuthor', 'lineClamp', 'replyContent', 'text', 'time', 'userAvator', 'userFlag', 'userName']
})
export class CccUserCommentCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['clickUser']);
  }
}

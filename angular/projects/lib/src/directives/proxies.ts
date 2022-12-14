/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@bnqkl/web-component';




export declare interface BnAnimationIcon extends Components.BnAnimationIcon {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['actived', 'direction', 'duration', 'frames', 'height', 'ratio', 'src', 'width'],
  methods: ['play', 'pause', 'finish', 'reset']
})
@Component({
  selector: 'bn-animation-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['actived', 'direction', 'duration', 'frames', 'height', 'ratio', 'src', 'width']
})
export class BnAnimationIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BnBlurGroundImage extends Components.BnBlurGroundImage {
  /**
   *  
   */
  update: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['blurRatio'],
  methods: ['getActiveImageElement', 'toBlob', 'toObjectURL', 'toDataURL']
})
@Component({
  selector: 'bn-blur-ground-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['blurRatio']
})
export class BnBlurGroundImage {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['update']);
  }
}


export declare interface BnCollectButton extends Components.BnCollectButton {
  /**
   *  
   */
  checkedChange: EventEmitter<CustomEvent<boolean>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checkLabel', 'checked', 'color', 'direction', 'disabled', 'icononly', 'unCheckLabel']
})
@Component({
  selector: 'bn-collect-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checkLabel', 'checked', 'color', 'direction', 'disabled', 'icononly', 'unCheckLabel']
})
export class BnCollectButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['checkedChange']);
  }
}


export declare interface BnConfigUtil extends Components.BnConfigUtil {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['assetPath'],
  methods: ['setAssetPath', 'getAssetPath']
})
@Component({
  selector: 'bn-config-util',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['assetPath']
})
export class BnConfigUtil {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BnDislikeButton extends Components.BnDislikeButton {
  /**
   *  
   */
  checkedChange: EventEmitter<CustomEvent<boolean>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checked', 'color', 'count', 'direction', 'disabled', 'icononly']
})
@Component({
  selector: 'bn-dislike-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'color', 'count', 'direction', 'disabled', 'icononly']
})
export class BnDislikeButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['checkedChange']);
  }
}


export declare interface BnHasMoreText extends Components.BnHasMoreText {
  /**
   * visibility state
true: open
false: hide 
   */
  openChanged: EventEmitter<CustomEvent<boolean>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['clampLine', 'lineHeight', 'open', 'text'],
  methods: ['toggleOpen']
})
@Component({
  selector: 'bn-has-more-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['clampLine', 'lineHeight', 'open', 'text']
})
export class BnHasMoreText {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['openChanged']);
  }
}


export declare interface BnIcon extends Components.BnIcon {
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
  selector: 'bn-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['direction', 'label', 'name', 'thin']
})
export class BnIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['countChanged']);
  }
}


export declare interface BnImage extends Components.BnImage {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['alt', 'crossOrigin', 'currentSrc', 'height', 'loading', 'pixelRatio', 'src', 'width'],
  methods: ['refresh']
})
@Component({
  selector: 'bn-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alt', 'crossOrigin', 'currentSrc', 'height', 'loading', 'pixelRatio', 'src', 'width']
})
export class BnImage {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BnImageCustomAdapter extends Components.BnImageCustomAdapter {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['pixelRatio'],
  methods: ['getTransfrom']
})
@Component({
  selector: 'bn-image-custom-adapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['pixelRatio']
})
export class BnImageCustomAdapter {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BnImageImaginaryAdapter extends Components.BnImageImaginaryAdapter {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['origin', 'pixelRatio', 'redirection'],
  methods: ['getTransfrom']
})
@Component({
  selector: 'bn-image-imaginary-adapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['origin', 'pixelRatio', 'redirection']
})
export class BnImageImaginaryAdapter {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { ImageTransform as IBnImageProviderImageTransform } from '@bnqkl/web-component';
export declare interface BnImageProvider extends Components.BnImageProvider {
  /**
   *  
   */
  adapterChange: EventEmitter<CustomEvent<IBnImageProviderImageTransform>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  methods: ['transform', 'transformFromElement']
})
@Component({
  selector: 'bn-image-provider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class BnImageProvider {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['adapterChange']);
  }
}


export declare interface BnImageToggleButton extends Components.BnImageToggleButton {
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
  selector: 'bn-image-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'checkedColor', 'color', 'direction', 'disabled', 'duration', 'frames', 'icononly', 'label', 'src']
})
export class BnImageToggleButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['checkedChange']);
  }
}

import type { $LazyState as IBnLazy$LazyState } from '@bnqkl/web-component';
export declare interface BnLazy extends Components.BnLazy {
  /**
   * ?????????????????????????????????????????????
???????????????????????????????????????????????????????????? auto-sleep ????????? 
   */
  lazyStateChange: EventEmitter<CustomEvent<IBnLazy$LazyState>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['autoSleep', 'debounce', 'lazyState'],
  methods: ['weakup', 'sleep']
})
@Component({
  selector: 'bn-lazy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoSleep', 'debounce', 'lazyState']
})
export class BnLazy {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['lazyStateChange']);
  }
}


export declare interface BnLikeButton extends Components.BnLikeButton {
  /**
   *  
   */
  checkedChange: EventEmitter<CustomEvent<boolean>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checked', 'color', 'count', 'direction', 'disabled', 'icononly']
})
@Component({
  selector: 'bn-like-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'color', 'count', 'direction', 'disabled', 'icononly']
})
export class BnLikeButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['checkedChange']);
  }
}


export declare interface BnLottieWeb extends Components.BnLottieWeb {
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
  selector: 'bn-lottie-web',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['actived', 'autoplay', 'data', 'defaultActivedColor', 'direction', 'loop', 'name', 'renderer', 'src']
})
export class BnLottieWeb {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['defaultActivedColorChange', 'startFrame', 'endFrame', 'countChanged']);
  }
}


export declare interface BnLottieWebToggleButton extends Components.BnLottieWebToggleButton {
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
  selector: 'bn-lottie-web-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['animationData', 'checked', 'direction', 'disabled', 'icononly', 'label', 'labelColor', 'name']
})
export class BnLottieWebToggleButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['checkedChange']);
  }
}


export declare interface BnPictureModelViewer extends Components.BnPictureModelViewer {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['alt', 'autoRotate', 'cameraOrbitRadius', 'environmentImage', 'fieldOfView', 'gltfSrc', 'interactionPrompt', 'skyboxImage', 'src', 'withCredentials']
})
@Component({
  selector: 'bn-picture-model-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alt', 'autoRotate', 'cameraOrbitRadius', 'environmentImage', 'fieldOfView', 'gltfSrc', 'interactionPrompt', 'skyboxImage', 'src', 'withCredentials']
})
export class BnPictureModelViewer {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BnReplyCommentButton extends Components.BnReplyCommentButton {
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
  selector: 'bn-reply-comment-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['commentInfo']
})
export class BnReplyCommentButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['userClick']);
  }
}

import type { $BnSlider as IBnSlider$BnSlider } from '@bnqkl/web-component';
export declare interface BnSlider extends Components.BnSlider {
  /**
   * ??????????????????????????????????????????????????????????????? 
   */
  activedSliderChange: EventEmitter<CustomEvent<[sliderEle: HTMLElement | undefined, index: number]>>;
  /**
   *  
   */
  activedIndexChange: EventEmitter<CustomEvent<IBnSlider$BnSlider.ActivedIndexChangeDetail>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['activedIndex', 'defaultActivedIndex'],
  methods: ['getLayoutInfo', 'getScrollProgress', 'getActivedIndex', 'slideTo', 'update', 'getReason']
})
@Component({
  selector: 'bn-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activedIndex', 'defaultActivedIndex']
})
export class BnSlider {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['activedSliderChange', 'activedIndexChange']);
  }
}


export declare interface BnSliderScrollbar extends Components.BnSliderScrollbar {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['duration', 'forLayout', 'forSlider'],
  methods: ['bindSliderElement', 'bindLayoutElement', 'update']
})
@Component({
  selector: 'bn-slider-scrollbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['duration', 'forLayout', 'forSlider']
})
export class BnSliderScrollbar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { $BnLayout as IBnSliderTabs$BnLayout } from '@bnqkl/web-component';
export declare interface BnSliderTabs extends Components.BnSliderTabs {
  /**
   * ?????????????????????????????????????????????????????????????????????????????????????????? 
   */
  layoutChange: EventEmitter<CustomEvent<IBnSliderTabs$BnLayout.LayoutChangeDetail>>;
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
  selector: 'bn-slider-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activedIndex', 'defaultActivedIndex', 'forSlider', 'forTabs']
})
export class BnSliderTabs {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['layoutChange', 'activedTabChange', 'activedIndexChange']);
  }
}


export declare interface BnStackingUtil extends Components.BnStackingUtil {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['text']
})
@Component({
  selector: 'bn-stacking-util',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['text']
})
export class BnStackingUtil {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BnSubTabsMenu extends Components.BnSubTabsMenu {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['forSlider'],
  methods: ['bindSliderElement']
})
@Component({
  selector: 'bn-sub-tabs-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['forSlider']
})
export class BnSubTabsMenu {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BnTemplate extends Components.BnTemplate {
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
  selector: 'bn-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['count']
})
export class BnTemplate {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['countChanged']);
  }
}


export declare interface BnTopTabsMenu extends Components.BnTopTabsMenu {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['forSlider'],
  methods: ['bindSliderElement']
})
@Component({
  selector: 'bn-top-tabs-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['forSlider']
})
export class BnTopTabsMenu {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BnUserCommentCard extends Components.BnUserCommentCard {
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
  selector: 'bn-user-comment-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['isAuthor', 'lineClamp', 'replyContent', 'text', 'time', 'userAvator', 'userFlag', 'userName']
})
export class BnUserCommentCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['clickUser']);
  }
}

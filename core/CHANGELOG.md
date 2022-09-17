# @bnqkl/web-component

## 1.14.0

### Minor Changes

- the event `checkedChange` in `<bn-image-toggle-button>` now is Preventable and no-composed
  refactor the `<bn-image-provider>`, and add `<bn-image-imaginary-adapter>`/`<bn-image-custom-adapter>`

## 1.13.0

### Minor Changes

- ⚡ imporve `<bn-slider>` and `<bn-slider-scrollbar>` performance
  💪 fix `<bn-top/sub-tabs-memu>` will missing `tabsEle` error
  ✨ `<bn-has-more-text>` add some toggle methods

## 1.12.2

### Patch Changes

- optimal the performance of `<bn-image>` when init

## 1.12.1

### Patch Changes

- `<bn-blur-ground-image>` add `update` event

## 1.12.0

### Minor Changes

- add new component: <bn-blur-ground-image />.
  wrap <img/> element, add blur background in container.

## 1.11.0

### Minor Changes

- `<bn-image>` add attr `cross-origin`, rename prop `proxySrc` to `currentSrc`

## 1.10.0

### Minor Changes

- `<bn-image>` export prop `proxySrc`

## 1.9.1

### Patch Changes

- `<bn-image>` data-width/height now support value: parent

## 1.9.0

### Minor Changes

- `<bn-image>` add slot: error/success/loading/img, add attr pixel-ratio, remove attr error-src

## 1.8.0

### Minor Changes

- 1. `<bn-picture-model-viewer>` hidden outline style
  2. `<bn-image>` add loading attribute
  3. `<bn-image-imaginary-provider>` add redirection support

## 1.7.1

### Patch Changes

- fix `<bn-lazy>` auto-sleep miss reflect config; and IntersectionObserver root should be null

## 1.7.0

### Minor Changes

- :sparkles: 对 picture-model-viewer 做了增强性的改进

  1. 改进了模型的 screen 面的材质，使之发光，避免颜色衰减
  2. 增加了 cameraOrbitRadius 与 fieldOfView 属性，使得开发者可以自定义：相机与模型的距离、以及相机的可视角
  3. 增加了 interactionPrompt 属性，默认本次会话里，在用户与 3d 模型交互过后，就不再提示用户可以进行交互

## 1.6.0

### Minor Changes

- `<bn-image-imaginary-provider>` exports transform methods

## 1.5.0

### Minor Changes

- base implements of `<bn-image>` and `<bn-image-imaginary-provider>` element

## 1.4.0

### Minor Changes

- picture-model-viewer exports attribute: 'auto-rotate' and 'environment-image'

## 1.3.0

### Minor Changes

- toggle button add onCheckedChange event

## 1.2.1

### Patch Changes

- picture-model-viewer add attr: with-credentials

## 1.2.0

### Minor Changes

- picture-model-viewer support custom poster

## 1.1.2

### Patch Changes

- bn-config-util use document.baseURI as baseurl

## 1.1.1

### Patch Changes

- fix assets path

## 1.1.0

### Minor Changes

- fix icon asset path

## 1.0.2

### Patch Changes

- fix postinstall

## 1.0.1

### Patch Changes

- <bn-config-util/> now has default assetPath: "./assets/"

## 1.0.0

### Major Changes

- first publish

# ccc-slider-scrollbar



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute               | Description                   | Type                  | Default     |
| --------------------------- | ----------------------- | ----------------------------- | --------------------- | ----------- |
| `activedIndex` _(required)_ | `actived-index`         |                               | `number`              | `undefined` |
| `defaultActivedIndex`       | `default-actived-index` |                               | `number \| undefined` | `undefined` |
| `forSlider`                 | `for-slider`            | the `<ccc-slider>` element id | `string \| undefined` | `undefined` |
| `forTabs`                   | `for-tabs`              |                               | `string \| undefined` | `undefined` |


## Events

| Event                | Description                    | Type                                                                                               |
| -------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `activedIndexChange` |                                | `CustomEvent<number>`                                                                              |
| `activedTabChange`   |                                | `CustomEvent<[tabEle: HTMLElement \| undefined, index: number]>`                                   |
| `layoutChange`       | 提供基础的布局信息，虽然自己不用，但是方便外部开发相关的组件 | `CustomEvent<{ box: { viewSize: number; scrollSize: number; }; blockList: { size: number; }[]; }>` |


## Methods

### `bindSliderElement(_sliderEle?: HTMLElement | null | undefined) => Promise<void>`

手动绑定或者解绑 for 元素
从而让 `<ccc-slider>` 元素能主动 根据自己的生命周期来与 tabs 进行绑定联动

#### Returns

Type: `Promise<void>`



### `getActivedIndex() => Promise<number>`



#### Returns

Type: `Promise<number>`



### `getLayoutInfo() => Promise<{ box: { viewOffsetLeft: number; viewOffsetWidth: number; viewSize: number; scrollSize: number; }; blockList: $Tab[]; activedIndex: number; activedTab: $Tab | undefined; }>`



#### Returns

Type: `Promise<{ box: { viewOffsetLeft: number; viewOffsetWidth: number; viewSize: number; scrollSize: number; }; blockList: $Tab[]; activedIndex: number; activedTab: $Tab | undefined; }>`



### `getScrollProgress() => Promise<number>`



#### Returns

Type: `Promise<number>`



### `slideTo(activedIndex: number) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"tabs"` |             |


----------------------------------------------

Copyright (c) BFChain

# ccc-tabs-slider



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                 | Type                  | Default     |
| -------------- | --------------- | --------------------------- | --------------------- | ----------- |
| `activedIndex` | `actived-index` |                             | `number \| undefined` | `0`         |
| `for`          | `for`           | the <ccc-silder> element id | `string \| undefined` | `undefined` |


## Events

| Event              | Description | Type                                         |
| ------------------ | ----------- | -------------------------------------------- |
| `activedTabChange` |             | `CustomEvent<[HTMLElement \| null, number]>` |


## Methods

### `bindForElement(_forEle?: HTMLElement | null | undefined) => Promise<void>`

手动绑定或者解绑for元素
从而栏 <ccc-slider> 元素能主动 根据自己的生命周期来与 tabs 进行绑定联动

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"cursor"` |             |
| `"spirit"` |             |
| `"tabs"`   |             |


----------------------------------------------

Copyright (c) BFChain
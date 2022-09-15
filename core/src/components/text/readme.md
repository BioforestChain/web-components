# bn-has-more-text



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default |
| ------------ | ------------- | ----------- | --------- | ------- |
| `clampLine`  | `clamp-line`  |             | `number`  | `3`     |
| `lineHeight` | `line-height` |             | `number`  | `0`     |
| `open`       | `open`        |             | `boolean` | `false` |
| `text`       | `text`        |             | `string`  | `""`    |


## Events

| Event         | Description                             | Type                   |
| ------------- | --------------------------------------- | ---------------------- |
| `openChanged` | visibility state true: open false: hide | `CustomEvent<boolean>` |


## Methods

### `hideMore() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `showMore() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `toggleMore(open?: boolean) => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Shadow Parts

| Part         | Description |
| ------------ | ----------- |
| `"btn-text"` |             |
| `"fold"`     |             |
| `"has-more"` |             |
| `"text"`     |             |
| `"unfold"`   |             |


----------------------------------------------

Copyright (c) BFChain

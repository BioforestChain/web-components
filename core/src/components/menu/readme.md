# ccc-sub-tabs-menu



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description      | Type                  | Default     |
| ----------- | ------------ | ---------------- | --------------------- | ----------- |
| `forSlider` | `for-slider` | 通过 `@Prop` 修饰器绑定 | `string \| undefined` | `undefined` |


## Methods

### `bindSliderElement(ele?: HTMLElement | null | undefined) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part          | Description |
| ------------- | ----------- |
| `"scrollbar"` |             |
| `"tabs"`      |             |


## Dependencies

### Depends on

- [ccc-slider-tabs](../slider)
- [ccc-slider-scrollbar](../slider)

### Graph
```mermaid
graph TD;
  ccc-top-tabs-menu --> ccc-slider-tabs
  ccc-top-tabs-menu --> ccc-slider-scrollbar
  style ccc-top-tabs-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

Copyright (c) BFChain

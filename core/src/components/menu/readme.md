# bn-sub-tabs-menu



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

- [bn-slider-tabs](../slider)
- [bn-slider-scrollbar](../slider)

### Graph
```mermaid
graph TD;
  bn-top-tabs-menu --> bn-slider-tabs
  bn-top-tabs-menu --> bn-slider-scrollbar
  style bn-top-tabs-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

Copyright (c) BFChain

# bn-lazy



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description               | Type                  | Default   |
| ----------- | ------------ | ------------------------- | --------------------- | --------- |
| `autoSleep` | `auto-sleep` | 是否自动进入睡眠状态                | `boolean`             | `false`   |
| `debounce`  | `debounce`   | 防抖，至少要显隐一定时间以上才能触发相应的状态变更 | `number`              | `120`     |
| `lazyState` | `lazy-state` | 视图当前的状态                   | `"sleep" \| "weakup"` | `"sleep"` |


## Events

| Event             | Description                                         | Type                               |
| ----------------- | --------------------------------------------------- | ---------------------------------- |
| `lazyStateChange` | 元素进入视野中的时候，唤醒视图 元素离开视野中的时候，进入睡眠（需要配置 auto-sleep 属性） | `CustomEvent<"sleep" \| "weakup">` |


## Methods

### `sleep() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



### `weakup() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Slots

| Slot       | Description |
| ---------- | ----------- |
| `"sleep"`  | 放置睡眠是要渲染的内容 |
| `"weakup"` | 放置唤醒时要渲染的内容 |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"sleep"`  |             |
| `"weakup"` |             |


----------------------------------------------

Copyright (c) BFChain

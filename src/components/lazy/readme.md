# ccc-lazy



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type                  | Default   |
| ----------- | ------------ | ----------- | --------------------- | --------- |
| `autoSleep` | `auto-sleep` | 是否自动进入睡眠状态  | `boolean`             | `false`   |
| `state`     | `state`      | 视图当前的状态     | `"sleep" \| "weakup"` | `"sleep"` |


## Events

| Event    | Description                         | Type                |
| -------- | ----------------------------------- | ------------------- |
| `sleep`  | 视图离开视野中的时候，进入睡眠（需要配置 auto-sleep 属性） | `CustomEvent<void>` |
| `weakup` | 视图进入视野中的时候，唤醒视图                     | `CustomEvent<void>` |


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

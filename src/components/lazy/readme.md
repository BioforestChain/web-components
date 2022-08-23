# ccc-lazy



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type                  | Default   |
| ----------- | ------------ | ----------- | --------------------- | --------- |
| `autoSleep` | `auto-sleep` |             | `boolean`             | `false`   |
| `state`     | `state`      |             | `"sleep" \| "weakup"` | `"sleep"` |


## Events

| Event    | Description  | Type                |
| -------- | ------------ | ------------------- |
| `sleep`  | destroy view | `CustomEvent<void>` |
| `weakup` | into view    | `CustomEvent<void>` |


## Methods

### `sleep() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



### `weakup() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"sleep"`  |             |
| `"weakup"` |             |


----------------------------------------------

Copyright (c) BFChain

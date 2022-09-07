# bn-picture-model-viewer



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description                                                                                                     | Type                   | Default     |
| ------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------- |
| `alt`               | `alt`                 | image alt                                                                                                       | `string \| undefined`  | `undefined` |
| `autoRotate`        | `auto-rotate`         |                                                                                                                 | `boolean \| undefined` | `undefined` |
| `cameraOrbitRadius` | `camera-orbit-radius` | 相机轨道中有$theta $phi $radius三个属性，这个是距离属性 格式为：$min-$default-$max 可以为缩写成: $min($default)-$max 或者：$min($default/$max) | `string \| undefined`  | `undefined` |
| `environmentImage`  | `environment-image`   | model 3d view environment image                                                                                 | `string`               | `"neutral"` |
| `fieldOfView`       | `field-of-view`       | 相机的视角，如果 cameraOrbitRadius 设置得很大，可以通过调整 fieldOfView 来拉近它                                                        | `string \| undefined`  | `undefined` |
| `gltfSrc`           | `gltf-src`            | .gltf 文件的链接，里头可以通过 {IMAGE_URL} 与 {IMAGE_MIME} 来匹配当前 src 所指向的图片                                                  | `string \| undefined`  | `undefined` |
| `interactionPrompt` | `interaction-prompt`  | 是否要显示交互提示 这里默认的行为是，只要用户有过交互行为，那么在本次访问中，它就默认为false了                                                              | `boolean \| undefined` | `undefined` |
| `skyboxImage`       | `skybox-image`        | model 3d view skybox image                                                                                      | `string \| undefined`  | `undefined` |
| `src` _(required)_  | `src`                 | image source                                                                                                    | `string`               | `undefined` |
| `withCredentials`   | `with-credentials`    | for cors                                                                                                        | `boolean \| undefined` | `undefined` |


----------------------------------------------

Copyright (c) BFChain

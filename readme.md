# CCC 前端组件库

希望大家养成组件化开发的习惯，这个仓库提供了一套标准来让大家进行开发。
该项目使用 svelte 作为组件标准进行开发，因为它默认没有携带运行时且是响应式框架。

> 如果确定要使用其它框架或者标准，请联系 [@kzf] 进行搭建，或者自己学习 storybook 自行搭建并分享

## 👩‍💻 如何使用 How To Use

1. 安装 Install

   ```shell
   # use npm
   npm install @ccchain/web-component

   # use yarn
   yarn install @ccchain/web-component
   ```

1. 安装

   1. 纯 Web 技术下，下载依赖包，使用 `dist/umd/index.js` 导入到你的网页中

      ```html
      <-- head -->
      <script type="module" src="@ccchain/web-component/dist/ccchain-web-component/ccchain-web-component.esm.js" />
      <-- body -->
      <ccc-some-com></ccc-some-com>
      ```

   1. 或者如果你能够对项目进行编译，那么在项目源码中导入，并执行 web-component 组件的注册，因为在此之前，你可以等待一些垫片的加载

      ```ts
      import { defineCustomElements } from "@ccchain/web-component";
      defineCustomElements();
      ```

1. 在项目中使用标签

   ```html
   <ccc-icon-comment></ccc-icon-comment>
   ```

## 🚀 贡献者·快速开始

1. 安装依赖
   ```shell
   yarn install # 确保依赖安装完毕
   ```
2. 启动开发编译，并启动 storybook 预览组件，并进行实时预览
   ```shell
   yarn start # 启动 stencil 内部的 ts+rollup 编译，导出js、并实时生成类型源文件、与文档
   yarn storybook # 启动 storybook 来对组件进行预览开发
   ```
   > 如果你同时在开发 Crabon-App 的 Angular 项目，那么他们是可以联动开发
3. 编译输出
   ```shell
   yarn build # 编译
   ```
   > 如果你同时在开发 Crabon-App 的 Angular 项目，那么 build 的结果也能实时联动到 angular 项目中进行预览

## 📦 贡献者·创建组件

```shell
yarn g YOUR_COMPONENT_NAME
```

其中`YOUR_COMPONENT_NAME`的命名风格有着严格的命名规范，比如：

1.  `yarn g your-component`，`-`用于替代空格
    > 最终你的组件会在 `your-component/ccc-your-component.tsx`中定义出`<ccc-your-component/>`的组件
1.  `yarn g button/some-feature`，`-`用于替代空格，`/`用于定义文件夹
    > 最终你的组件会在 `button/ccc-button-some-feature.tsx`中定义出`<ccc-button-some-feature/>`的组件

与此同时，组件中会自动生成 `stories` 文件夹下会出现一个对应的“故事文件”，比如`your-component.stories.ts`。在该文件中，也同样享有严格的类型检查。前提是你要安装 vscode-lit 插件

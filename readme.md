# CCC 前端组件库

希望大家养成组件化开发的习惯，这个仓库提供了一套标准来让大家进行开发。
该项目使用 stencil 作为组件标准进行开发，它提供了很多便捷的开箱即用的标准，以及高度可定制的编译工具链，使得我们可以跟 angular 项目的编译实时联动。

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
   # 你可能需要以下这些指令帮助你完成依赖的安装
   # $env:PUPPETEER_DOWNLOAD_HOST="https://npm.taobao.org/mirrors/"
   # $env:PUPPETEER_SKIP_DOWNLOAD=1
   # $env:PUPPETEER_DOWNLOAD_HOST="http://192.168.110.154:8080/puppeteer/"
   yarn install # 确保依赖安装完毕
   ```
2. 启动开发编译，并启动 storybook 预览组件，并进行实时预览
   ```shell
   yarn dev
   # 启动 stencil 内部的 ts+rollup 编译，导出js、并实时生成类型源文件、与文档
   # 启动 storybook 来对组件进行预览开发
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
    > 最终你的组件会在 `button/ccc-some-feature-button.tsx`中定义出`<ccc-some-feature-button/>`的组件

与此同时，组件中会自动生成 `stories` 文件夹下会出现一个对应的“故事文件”，比如`your-component.stories.ts`。在该文件中，也同样享有严格的类型检查。前提是你要安装 vscode-lit 插件

## 📦 贡献者·一些已知的问题

1. 在 Angular 项目开发时，的 HMR 模式下（通过`yarn dev:hmr`）启动，webcomponet 是无法正确重载的（因为 WebComponent 无法重新注册）。所以建议是：
   1. 如果在编写 Angular-HTML 或者是开发调试 WebComponent，那么关闭 HMR，等将元素的结构放置完成后，再进入 .scss 的编写
   1. 如果再编写 Angular-SCSS，那么开启 HMR，.scss 文件可以动态重载，但是这时候如果有修改到 .html 文件的时候，可能需要手动刷新才能让 WebComponent 正确渲染
2. 当你在组件中配置了 assetDir 的属性后，需要重启编译，否则无法正确进行资源拷贝

## 📦 贡献者·动态图标

lottie 动画图标会占用大量的资源，所以我们新的方案是将之预渲染成图片，使用精灵图+CSS-Animation-API 进行动画控制。
精灵图的制作方法是：

1.  到 [www.codeandweb.com/free-sprite-sheet-packer] 中，将图片一帧帧“水平”放上去，然后将帧间距 Padding 改成 0（它有 bug，一定要先 1px 再 0px 才能正确生效）
1.  如果一个动画有多种风格，那么将水平图垂直放置合并在一张精灵图中
1.  到 [squoosh.app] 中，将合并好的 png 图片导入：
    1.  选择 webp 格式
    1.  勾上 Lossless 配置（不然颜色会丢，这对图标动画这种精致的、色调单一的小图片来说并不友好）
    1.  Effort 拉满
    1.  Quality 控制在 100%~60%之间，越高越好，前提是不要丢失细节

这样导出的图片跟 lottie-web 的 json 文件差不多大，甚至可以更小，同时渲染效率也会更高。

## 📦 贡献者·静态图标

我们使用 iconmoon 来管理图标

## TODO

- [ ] 一个文件夹中放置多个组件的支持不够好，readme 只会有一个。
  > 正确的操作是将这些组件的文档的内容分别放在对应的 stories.mdx 中。同时 readme.md 归纳了所有组件的文档，并提供 readme 该有的信息

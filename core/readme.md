# Bnqkl 前端组件库

该项目使用 stencil 作为组件标准进行开发，它提供了很多便捷的开箱即用的标准，以及高度可定制的编译工具链，使得我们可以跟 angular 项目的编译实时联动。
该项目的主要风格并不是传统的 UI 库，而是更加纯粹的功能性仓库，是对于现代 HTML5 基础组件的一些补充。

> 如果确定要使用其它框架或者标准，请联系 [@kzf] 进行搭建，或者自己学习 storybook 自行搭建并分享

## 👩‍💻 如何使用 How To Use

1. 安装 Install

   ```shell
   # use npm
   npm install @bnqkl/web-component

   # use yarn
   yarn install @bnqkl/web-component
   ```

1. 使用 Usage

   1. 纯 Web 技术下，下载依赖包，使用 `dist/umd/index.js` 导入到你的网页中

      ```html
      <-- head -->
      <script type="module" src="@bnqkl/web-component/dist/bnqkl-web-component/bnqkl-web-component.esm.js" />
      <-- body -->
      <bn-some-com></bn-some-com>
      ```

   1. 或者如果你能够对项目进行编译，那么在项目源码中导入，并执行 web-component 组件的注册，因为在此之前，你可以等待一些垫片的加载

      ```ts
      import { defineCustomElements } from "@bnqkl/web-component";
      defineCustomElements();
      ```

1. 在项目中使用标签

   ```html
   <bn-icon-comment></bn-icon-comment>
   ```

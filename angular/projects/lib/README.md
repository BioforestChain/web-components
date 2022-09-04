# Bnqkl Web-Component for Angular

该项目的大部分代码是由主项目自动导出，具体变动详见 [CHANGELOG]('./CHANGELOG.md')

主项目是一个纯 Web Component 项目，可以与当前的任何 Web 项目进行搭配使用，详见 [core project]('../core/README.md')

## 如何使用 How To Use

1. 在你的 Angular 项目中安装这两个依赖包

   ```shell
   # run npm install / yarn add / pnpm install in your angular project
   cd $YOUR_PROJECT
   # install both
   npm install @bnqkl/web-component-angular @bnqkl/web-component
   ```

1. 在你的 angular.json 中配置资源文件夹

   > projects/$YOUR_PROJECT/architect/build/assets

   ```json
   {
     "glob": "*",
     "input": "node_modules/@bnqkl/web-component/assets",
     "output": "assets/bnqkl-web-component"
   }
   ```

1. 在你的 Angular 项目中引入它，并配置它：

   > app.module.ts

   ```ts
   import { BnWebComponentModule } from "@bnqkl/web-component-angular";
   @NgModule({
     //...
     imports: [
       //...
       BnWebComponentModule,
     ],
     //...
   })
   export class AppModule {
     //...
   }
   ```

   > app.component.html

   ```html
   <bn-config-util assetPath="./assets/bnqkl-web-component/"></bn-config-util>
   ```

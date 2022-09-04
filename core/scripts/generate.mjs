// @ts-check
import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { createResolveTo } from "./util/resolveTo.mjs";
import { trimLines } from "./util/trim.mjs";
import { walkFiles } from "./util/walkFiles.mjs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const treeify = require("treeify");

const resolveTo = createResolveTo(import.meta.url);

const generateComponent = async () => {
  const ROOTDIR = resolveTo("../");
  const PACKAGE_TPL_DIR = resolveTo("../src/components/template");
  let inputName = process.argv.slice(2).pop() || "";
  if (!inputName) {
    throw new Error("no found component name");
  }

  if (inputName.includes(".") || inputName.includes("_")) {
    throw new Error("invalid name, should not include '.' or '_'");
  }

  inputName = inputName
    // 将大写字符转成 小写并在前面加上分隔符
    .replace(/[A-Z]/g, uw => {
      return `-${uw.toLowerCase()}`;
    })
    /// 将多个分隔符或者特殊符号转成一个分隔符
    .replace(/[\-\_\/]+/g, s => (s.includes("/") ? "/" : "-"))
    /// 移除开头和末尾的特殊符号
    .replace(/^\-/, "")
    .replace(/[\-\_]$/, "");

  if (inputName === "template") {
    throw new Error("invalid name, should no be 'template'");
  }

  let dirname = inputName;
  let basename = inputName;
  {
    const nsList = dirname.split("/");
    switch (nsList.length) {
      case 1:
        dirname = nsList[0];
        basename = nsList[0];
        break;
      case 2:
        dirname = nsList[0];
        basename = nsList[1];
        break;
      default:
        throw new Error("too many namespace");
    }
  }
  // inputName = inputName.replace(/\//g, "-");

  const PACKAGE_TARGET_DIR = resolveTo(`../src/components/${dirname}`);
  const tagBaseName = [...new Set([...basename.split(/[\_\-]/), ...dirname.split(/[\_\-]/)])].join("-");

  const tagName = `bn-${tagBaseName}`;
  const classBaseName = tagBaseName
    // 首字母大写
    .replace(/^\w/, s => s.toUpperCase())
    // 转驼峰
    .replace(/-\w/g, s => s[1].toUpperCase());
  const className = `Bn${classBaseName}`;
  const classInstanceName = `bn${classBaseName}`;

  const storyBaseTitle = inputName
    // 首字母大写
    .replace(/^\w/, s => s.toUpperCase())
    // 斜杠后面的字母大写
    .replace(/\/\w/, s => "/" + s[1].toUpperCase())
    // 分隔符+字母 转 空格+大写
    .replace(/-\w/g, s => " " + s[1].toUpperCase());
  const storyComponentTitle = `Component/${storyBaseTitle}`;
  const storyDocumentTitle = `Document/${storyBaseTitle}`;

  const q = readline.createInterface(process.stdin, process.stdout);
  const question = ask =>
    new Promise(resolve => {
      q.question(ask, anwser => {
        resolve(anwser);
      });
    });

  const mirco = str =>
    str
      // .replace(/PACKAGE-NAME/g, packageName)
      .replace(/template/g, tagBaseName)
      .replace(/bn-template/g, tagName)
      .replace(/BnTemplate/g, className)
      .replace(/bnTemplate/g, classInstanceName)
      .replace(/Template\/ComponentTitle/g, storyComponentTitle)
      .replace(/Template\/DocumentTitle/g, storyDocumentTitle)
      .replace(/Template/g, classBaseName);

  // `${chalk.gray("package name")}:\t${chalk.blue(packageName)}
  let needCoverFile = false;
  const YorN = await question(
    [
      `${chalk.gray("html tag")}:\t${chalk.green(`<${tagName} />`)} `,
      `${chalk.gray("class name")}:\t${chalk.red(`${className}`)} `,
      `${chalk.gray("story title")}:\t${chalk.blueBright(`${storyComponentTitle}`)}`,
      `${chalk.gray("write files")}:\t${chalk.cyan(path.relative(ROOTDIR, PACKAGE_TARGET_DIR).replace(/\\/g, "/"))}`,
      `${(() => {
        const fileTree = {};
        for (const filepath of walkFiles(PACKAGE_TPL_DIR)) {
          const targetRelativePath = mirco(path.relative(PACKAGE_TPL_DIR, filepath));
          const targetPath = path.join(PACKAGE_TARGET_DIR, targetRelativePath);
          const existFile = fs.existsSync(targetPath);
          needCoverFile || (needCoverFile = existFile);

          let fileNode = fileTree;
          targetRelativePath.split(/[\/\\]/).forEach((pair, index, list) => {
            if (index === list.length - 1) {
              let info = "";
              if (pair === "autogen.ts") {
                info = "storybook writer kit, auto generate!";
              } else if (pair === "readme.md") {
                info = "document, auto generate!";
              } else if (pair.endsWith(".scss")) {
                info = "component stylesheet";
              } else if (pair.endsWith(".stories.ts")) {
                info = "storybook file";
              } else if (pair.endsWith(".tsx")) {
                info = "stencli component";
              }
              fileNode[existFile ? chalk.bgRed(pair) : pair] = info ? chalk.gray("// " + info) : null;
            } else {
              fileNode = fileNode[pair] ??= {};
            }
          });
        }
        return treeify
          .asTree(fileTree, true)
          .split("\n")
          .map(line => "  " + line.replace(/^\s*([\W]+?)\s/, (p, s) => p.replace(s, chalk.cyan(s))))
          .join("\n");
      })()}`,

      `${chalk.cyan`create web-component with stencli style`} ${chalk.underline`Y`}${chalk.gray`/n`}`,
    ].join("\n"),
  );
  if (YorN.toLowerCase().includes("n")) {
    process.exit(0);
    return;
  }
  if (needCoverFile) {
    const YorN = await question(
      `${chalk.bgRed("files will be cover, keep enforce?")}  ${chalk.gray`y/`}${chalk.underline`N`}`,
    );
    if (YorN.toLowerCase().includes("y") === false) {
      process.exit(0);
      return;
    }
  }

  const writeTplFile = (tplFilepath, tplDir, targetDir) => {
    const targetPath = path.join(targetDir, mirco(path.relative(tplDir, tplFilepath)));
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, mirco(fs.readFileSync(tplFilepath, "utf-8")));
  };

  for (const filepath of walkFiles(PACKAGE_TPL_DIR)) {
    writeTplFile(filepath, PACKAGE_TPL_DIR, PACKAGE_TARGET_DIR);
  }

  console.log("project created at:", chalk.cyan(path.relative(ROOTDIR, PACKAGE_TARGET_DIR)));

  process.exit(0);
};

generateComponent().catch(e => {
  if (e instanceof Error) {
    console.error(e.stack?.replace(e.message, chalk.red(e.message)) ?? chalk.red(e.message));
  } else {
    console.error(e);
  }
});

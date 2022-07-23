// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { createResolveTo } from "./util/resolveTo.mjs";
import { walkFiles } from "./util/walkFiles.mjs";
const resolveTo = createResolveTo(import.meta.url);

export const doCopy = (assetSrc = "build-copy") => {
  const TPL_DIR = resolveTo(`../assets/${assetSrc}`);
  const TAR_DIR = resolveTo("../dist");
  const SOURCE = "/* SOURCE */";
  const SOURCE_START = "/* SOURCE-START */";
  const SOURCE_END = "/* SOURCE-END */";

  for (const templateFilepath of walkFiles(TPL_DIR)) {
    const targetFilepath = path.resolve(TAR_DIR, path.relative(TPL_DIR, templateFilepath));
    fs.mkdirSync(path.dirname(targetFilepath), { recursive: true });
    let templateCode = fs.readFileSync(templateFilepath, "utf-8");
    const SOURCE_CODE = fs.existsSync(targetFilepath) ? fs.readFileSync(targetFilepath, "utf-8") : "";
    if (templateCode.includes(SOURCE)) {
      let sourceCode = SOURCE_CODE;
      {
        /// 抽取出源码的部分，避免重复注入
        const sourceStart = sourceCode.indexOf(SOURCE_START);
        const sourceEnd = sourceCode.lastIndexOf(SOURCE_END);
        if (sourceStart !== -1 && sourceEnd !== -1) {
          sourceCode = sourceCode.substring(sourceStart + SOURCE_START.length, sourceEnd);
        }
      }
      templateCode = templateCode.replace(SOURCE, SOURCE_START + sourceCode + SOURCE_END);
    }

    if (SOURCE_CODE !== templateCode) {
      fs.writeFileSync(targetFilepath, templateCode);
      console.log("fixed", targetFilepath);
    }
  }
};

if (path.resolve(process.cwd(), process.argv[1]) == fileURLToPath(import.meta.url)) {
  // console.log("do copy", process.argv[2]);

  doCopy(process.argv[2]);
}

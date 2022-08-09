// @ts-check
const path = require("node:path");
const fs = require("node:fs");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const { createResolveTo } = require("./util/resolveTo.cjs");
const { walkFiles } = require("./util/walkFiles.cjs");
const resolveTo = createResolveTo(__dirname);

const doCopy = async (assetSrc = "build-copy") => {
  const TPL_DIR = resolveTo(`../assets/${assetSrc}`);
  const TAR_DIR = resolveTo("../dist");
  const SOURCE = "/* SOURCE */";
  const SOURCE_START = "/* SOURCE-START */";
  const SOURCE_END = "/* SOURCE-END */";
  const EVAL_START = "/* EVAL-START */";
  const EVAL_END = "/* EVAL-END */";

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
    if (templateCode.includes(EVAL_START)) {
      const evalStart = templateCode.indexOf(EVAL_START);
      const evalEnd = templateCode.lastIndexOf(EVAL_END);

      if (evalStart !== -1 && evalEnd !== -1) {
        const evalCode = templateCode.substring(evalStart, evalEnd);
        const context = vm.createContext(Object.create(globalThis));
        context.require = createRequire(templateFilepath);
        context.__filename = templateFilepath;
        context.__dirname = path.dirname(templateFilepath);
        vm.runInContext(evalCode, context);
        let inject = context.inject;
        if (typeof context.inject === "function") {
          inject = await context.inject();
        }

        inject = String(inject ?? "");
        templateCode = templateCode.slice(0, evalStart) + EVAL_START + inject + templateCode.slice(evalEnd);
      }
    }

    if (SOURCE_CODE !== templateCode) {
      fs.writeFileSync(targetFilepath, templateCode);
      console.log("fixed", targetFilepath);
    }
  }
};
exports.doCopy = doCopy;

if (require.main === module) {
  doCopy(process.argv[2]);
}

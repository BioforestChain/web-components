const path = require("node:path");
const { walkFiles } = require("../scripts/util/walkFiles.cjs");
const { createResolveTo } = require("../scripts/util/resolveTo.cjs");
const resolveTo = createResolveTo(__dirname);

exports.inject = () => {
  let inject = "";
  debugger
  for (const filepath of walkFiles(resolveTo("../dist/types/components"))) {
    if (filepath.endsWith(".const.ts") || filepath.endsWith(".const.tsx")) {
      inject += `\nexport * from ${JSON.stringify(
        path
          .relative(resolveTo("../dist/types"), filepath)
          .replace(/\.tsx?$/, "")
          .replace(/\\{1,}/g, "/") /* .ts */,
      )};`;
    }
  }
  return inject;
};

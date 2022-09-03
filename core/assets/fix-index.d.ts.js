const path = require("node:path");
const { walkFiles } = require("../scripts/util/walkFiles.cjs");
const { createResolveTo } = require("../scripts/util/resolveTo.cjs");
const resolveTo = createResolveTo(__dirname);

exports.inject = () => {
  let inject = "";
  debugger;
  const componentsTypeDir = resolveTo("../dist/types/components");
  const componentsSrcDir = resolveTo("../src/components");
  for (const filepath of walkFiles(componentsSrcDir)) {
    if (filepath.endsWith(".const.ts") || filepath.endsWith(".const.tsx")) {
      const destFilepath = path.join(componentsTypeDir, path.relative(componentsSrcDir, filepath));
      inject += `\nexport * from ${JSON.stringify(
        "./" +
          path
            .relative(resolveTo("../dist/types"), destFilepath)
            .replace(/\.tsx?$/, "")
            .replace(/\\{1,}/g, "/") /* .ts */,
      )};`;
    }
  }
  return inject;
};

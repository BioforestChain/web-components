const path = require("node:path");
const { walkFiles } = require("../scripts/util/walkFiles.cjs");
const { createResolveTo } = require("../scripts/util/resolveTo.cjs");
const resolveTo = createResolveTo(__dirname);

exports.inject = () => {
  let inject = "";
  const componentsTypeDir = resolveTo("../dist/types/");
  const componentsSrcDir = resolveTo("../src/");
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

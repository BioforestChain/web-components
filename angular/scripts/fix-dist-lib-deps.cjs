// @ts-check
const path = require("node:path");
const fs = require("node:fs");
const resolveTo = (...args) => path.resolve(__dirname, ...args);
const readJson = (filepath) => {
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
};
const writeJson = (filepath, json) => {
  fs.writeFileSync(filepath, JSON.stringify(json, null, 4));
};

(async () => {
  const srcDirNodeModules = resolveTo("../projects/lib/node_modules");

  const distPackageJsonFilepath = resolveTo("../dist/lib/package.json");
  const distPackageJson = readJson(distPackageJsonFilepath);

  for (const pkey of [
    "dependencies",
    "peerDependencies",
    "optionalDependencies",
    "devDependencies",
  ]) {
    const dependencies = distPackageJson[pkey];
    if (!dependencies) {
      continue;
    }
    for (const [name, version] of Object.entries(dependencies)) {
      if (version.startsWith("workspace:")) {
        const trulyVersion = readJson(
          resolveTo(srcDirNodeModules, name, "package.json")
        ).version;
        dependencies[name] = "~" + trulyVersion;
        console.log("replace", pkey, name, version, "=>", trulyVersion);
      }
    }
  }

  writeJson(distPackageJsonFilepath, distPackageJson);
})();

const fs = require("node:fs");
const path = require("node:path");
const prettier = require("prettier");
/**
 * @type {<T>(filepath:string)=>T}
 * @param {string} filepath
 */
const importJson = filepath => {
  try {
    return Function(`return (${fs.readFileSync(filepath, "utf-8")})`)();
  } catch {}
};
exports.importJson = importJson;

const prettierRc = importJson(path.join(__dirname, "../../.prettierrc.json"));

const exportJson = (filepath, jsonContent, opts = {}) => {
  const { autoRemoveEmptyObjectKeys } = opts;
  if (autoRemoveEmptyObjectKeys) {
    jsonContent = { ...jsonContent };
    for (const key of autoRemoveEmptyObjectKeys) {
      let hasKey = false;
      for (const _ in jsonContent[key]) {
        hasKey = true;
        break;
      }
      if (hasKey === false) {
        delete jsonContent[key];
      }
    }
  }
  fs.writeFileSync(
    filepath,
    prettier.format(JSON.stringify(jsonContent, null, 2), {
      ...prettierRc,
      parser: "json-stringify",
    }),
  );
};
exports.exportJson = exportJson;

const exportTs = (filepath, tsContent, opts = {}) => {
  fs.writeFileSync(
    filepath,
    prettier.format(tsContent, {
      ...prettierRc,
      parser: "typescript",
    }),
  );
};

exports.exportTs = exportTs;

import fs from "node:fs";
import prettier from "prettier";
/**
 * @type {<T>(filepath:string)=>T}
 * @param {string} filepath
 */
export const importJson = filepath => {
  try {
    return Function(`return (${fs.readFileSync(filepath, "utf-8")})`)();
  } catch {}
};

import prettierRc from "../../.prettierrc.json" assert { type: "json" };

export const exportJson = (filepath, jsonContent, opts = {}) => {
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

export const exportTs = (filepath, tsContent, opts = {}) => {
  fs.writeFileSync(
    filepath,
    prettier.format(tsContent, {
      ...prettierRc,
      parser: "typescript",
    }),
  );
};

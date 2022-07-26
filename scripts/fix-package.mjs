// @ts-check
import fs from "node:fs";
import { createResolveTo } from "./util/resolveTo.mjs";

const resolveTo = createResolveTo(import.meta.url);
{
  const stencil_sass = resolveTo(`../node_modules/@stencil/sass/dist/index.js`);
  let changed = false;
  const content = fs.readFileSync(stencil_sass, "utf8").replace(`Array.from(sassResult.stats.includedFiles)`, () => {
    changed = true;
    return `Array.from(sassResult.stats.includedFiles,(filepath)=>filepath.replace(/\\\\+/g,'/'))`;
  });
  if (changed) {
    fs.writeFileSync(stencil_sass, content);
    console.log("fixed @stencil/sass");
  }
}

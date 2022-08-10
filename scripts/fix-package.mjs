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

{
  // const angular_output_target = resolveTo(`../node_modules/@stencil/angular-output-target/dist/index.cjs.js`);
  // const source = fs.readFileSync(angular_output_target, "utf-8");
  // const fixed_source = source.replace(
  //   /const outputTypeRemapped = [\w\W]+? output.complexType.original/,
  //   fs.readFileSync(resolveTo("./angular-output-target.snippet"), "utf-8"),
  // );
  // if (source !== fixed_source) {
  //   fs.writeFileSync(angular_output_target, fixed_source);
  //   console.log("fixed @stencil/angular-output-target");
  // }
}

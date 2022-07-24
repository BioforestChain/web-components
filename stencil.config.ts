import { angularOutputTarget } from "@stencil/angular-output-target";
import { Config } from "@stencil/core";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import prettierConfig from "./.prettierrc.json"; // assert {type:"json"}
import packageJson from "./package.json";

const resolveTo = (to: string) => path.join(__dirname, to);

export const config: Config = {
  namespace: packageJson.name.replace("@", "").replace("/", "-"),
  hashFileNames: true,
  plugins: [],
  rollupPlugins: {
    after: [
      ...(process.argv.includes("--dev")
        ? [
            (() => {
              let checkTi: any;
              const CHECK_MAX_TIMES = 10;
              let checkTimes = 0;
              const doCopy = () => {
                const p = execFile("node", [resolveTo("./scripts/fix-index.mjs"), "dev-copy"], {});
                p.stdout?.pipe(process.stdout);
                p.stderr?.pipe(process.stderr);
              };
              return {
                name: "fix-input",
                buildStart() {
                  clearInterval(checkTi);
                },
                generateBundle() {
                  // console.log("generateBundle");
                  doCopy();
                  // console.log("fixed index.js");

                  /// 因为 ts 的编译可能会慢一点，所以这里 0.5s 检查一次，看有没有被覆盖写回去了
                  checkTimes = CHECK_MAX_TIMES;
                  checkTi = setInterval(() => {
                    doCopy();
                    if (--checkTimes <= 0) {
                      clearInterval(checkTi);
                    }
                    // console.log("checking X", CHECK_MAX_TIMES - checkTimes);
                  }, 500);
                },
              };
            })(),
          ]
        : []),
    ],
  },
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader", // for old browser
      // copy: [{ src: "../assets/copy", dest: ".." }],
    },
    // {
    //   type: "dist-custom-elements",
    // },
    {
      type: "docs-readme",
      footer: "Copyright (c) BFChain",
    },
    {
      type: "docs-custom",
      generator(docs, config) {
        const enum KPT {
          attr = "",
          bool = "?",
          prop = ".",
          event = "@",
        }
        const autoGen_header = `
        import { html, HTMLTemplateResult } from 'lit-html';
        import type { JSX } from '../../../components';
        import { ArgFactory, defineStory } from '../../../stories/util';
        `;
        const autoGen_Map = new Map<string, string[]>();

        for (const component of docs.components) {
          if (!component.dirPath) {
            continue;
          }
          const storiesAutogenTsFilepath = path.join(component.dirPath, "stories/autogen.ts");
          const instanceName = component.tag
            // 转成驼峰式
            .replace(/[\-\_]\w/g, s => s[1].toUpperCase());
          const className = instanceName
            // 首字母大写
            .replace(/^\w/, s => s[0].toUpperCase());

          type kp = { t: KPT; k: string; p: string };
          const bindNames: kp[] = [];
          const storiesAutogenTsContent = `
            export const ${instanceName}Kit = (() => {

              const argsFactory = new ArgFactory<JSX.${className}>()
              ${[
                ...component.props.map(prop => {
                  /// 弃用的字段就跳过
                  if (prop.deprecation) {
                    return;
                  }
                  try {
                    const defineOpts = `{
                      defaultValue: ${prop.default},
                      description: ${JSON.stringify(prop.docs || "")},
                    }`;
                    const defineName = JSON.stringify(prop.name);
                    let code: string | undefined;
                    switch (prop.type) {
                      case "string":
                        code = `.defineString(${defineName}, ${defineOpts})`;
                        break;
                      case "boolean":
                        code = `.defineBoolean(${defineName}, ${defineOpts})`;
                        break;
                      case "number":
                        code = `.defineNumber(${defineName}, ${defineOpts})`;
                        break;
                      default:
                        if (prop.type.includes("|")) {
                          try {
                            const options = Function(`return [${prop.type.replace(/|/g, ",")}]`)();
                            code = `.defineEnum(${defineName}, ${JSON.stringify(options)}, ${defineOpts})`;
                            break;
                          } catch {}
                        }
                    }

                    if (code) {
                      if (prop.attr && prop.type === "boolean") {
                        bindNames.push({
                          t: prop.type === "boolean" ? KPT.bool : KPT.attr,
                          k: prop.attr,
                          p: prop.name,
                        });
                      } else {
                        bindNames.push({
                          t: KPT.prop,
                          k: prop.name,
                          p: prop.name,
                        });
                      }
                    }
                    return code;
                  } catch {}
                }),
                ...component.events.map(event => {
                  /// 弃用的字段就跳过
                  if (event.deprecation) {
                    return;
                  }
                  try {
                    const defineOpts = `{
                      description: ${JSON.stringify(event.docs || "")},
                    }`;
                    const propName = `on${event.event // 首字母大写
                      .replace(/^\w/, s => s[0].toUpperCase())}`;
                    const code = `.defineAction(${JSON.stringify(propName)}, ${defineOpts})`;
                    bindNames.push({ t: KPT.event, k: event.event, p: propName });
                    return code;
                  } catch {}
                }),
              ]
                .filter(Boolean)
                .join("\n")}
  
              const storyFactory = (slot: (args: Partial<Partial<JSX.${className}>>) => HTMLTemplateResult, args?: Partial<JSX.${className}>) => {
                return defineStory<JSX.${className}>(args => {
                  return html\`<${component.tag} ${bindNames
            .map(attrKp => `${attrKp.t}${attrKp.k}=\${args.${attrKp.p}}`)
            .join(" ")}>
                    <!-- custom child elements -->
                    \${slot(args)}
                  </${component.tag}>\`;
                }, argsFactory.toArgs(args));
              };
              return { argsFactory, storyFactory };
            })();
          `;
          const contentList = autoGen_Map.get(storiesAutogenTsFilepath) ?? [];
          contentList.push(storiesAutogenTsContent);
          autoGen_Map.set(storiesAutogenTsFilepath, contentList);
        }

        /// 写入到文件中
        for (const [storiesAutogenTsFilepath, contentList] of autoGen_Map) {
          let storiesAutogenTsContent = autoGen_header + contentList.join("\n");
          // console.log(storiesAutogenTsFilepath);
          storiesAutogenTsContent = prettier.format(storiesAutogenTsContent, {
            parser: "typescript",
            ...(prettierConfig as any),
          });

          fs.mkdirSync(path.dirname(storiesAutogenTsFilepath), { recursive: true });
          if (
            fs.existsSync(storiesAutogenTsFilepath) &&
            fs.readFileSync(storiesAutogenTsFilepath, "utf-8") === storiesAutogenTsContent
          ) {
            continue;
          }
          fs.writeFileSync(storiesAutogenTsFilepath, storiesAutogenTsContent);
        }
      },
    },
    ...(() => {
      /// 寻找angular项目
      const angularJsonPath = resolveTo("../app/angular.json");
      if (fs.existsSync(angularJsonPath) === false) {
        return [];
      }
      return [
        angularOutputTarget({
          componentCorePackage: packageJson.name,
          directivesProxyFile: "../app/src/directives/web-component/components.ts",
          directivesArrayFile: "../app/src/directives/web-component/index.ts",
        }),
      ];
    })(),
  ],
  preamble: "Copyright (c) BFChain\nLicense CC-BY-NC-SA-4.0",
};

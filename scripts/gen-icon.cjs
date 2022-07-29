// @ts-check
const path = require("node:path");
const fs = require("node:fs");
const { createResolveTo } = require("./util/resolveTo.cjs");
const { walkFiles } = require("./util/walkFiles.cjs");
const { importJson, exportJson, exportTs } = require("./util/jsonModule.cjs");
const resolveTo = createResolveTo(__dirname);

/**
 *
 * @param {string} ccchain_icomoon_path
 */
const doGenIcon = ccchain_icomoon_path => {
  const src_resolveTo = createResolveTo(ccchain_icomoon_path);
  const des_resolveTo = createResolveTo(resolveTo("../src/components/icon/assets"));

  const cccIconMetadata = {};

  /// 处理json
  const selection_json_src_filepath = src_resolveTo("selection.json");
  for (const icon of importJson(selection_json_src_filepath).icons) {
    const codes = icon.properties.codes ?? [icon.properties.code];
    const iconMetadata = codes.map((code, i) => {
      /// 将 svg的attr 转化成 css的style
      const attr = icon.icon.attrs[i];
      const style = {
        ...attr,
        zIndex: i,
      };
      style.color = style.fill ? `var(--color-${i + 1}, ${attr.fill})` : undefined;
      delete style.fill;
      return {
        char: String.fromCharCode(code),
        style,
      };
    });
    cccIconMetadata[icon.properties.name] = iconMetadata;
  }
  exportJson(des_resolveTo("./cccicon.json"), cccIconMetadata);

  const name_ts_des_filepath = des_resolveTo("../ccc-icon.name.ts");
  exportTs(
    name_ts_des_filepath,
    `export type $CccIconName =` +
      Object.keys(cccIconMetadata)
        .map(n => `"${n}"`)
        .join("|"),
  );
};

exports.doGenIcon = doGenIcon;

if (require.main === module) {
  doGenIcon(process.argv[2]);
}

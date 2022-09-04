// @ts-check
const path = require("node:path");
const fs = require("node:fs");
const { createResolveTo } = require("./util/resolveTo.cjs");
const { walkFiles } = require("./util/walkFiles.cjs");
const { importJson, exportJson, exportTs } = require("./util/jsonModule.cjs");
const resolveTo = createResolveTo(__dirname);

/**
 *
 * @param {string} bnqkl_icomoon_path
 */
const doGenIcon = bnqkl_icomoon_path => {
  const src_resolveTo = createResolveTo(bnqkl_icomoon_path);
  const des_resolveTo = createResolveTo(resolveTo("../src/components/icon/assets"));

  const bnIconMetadata = {};

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
    bnIconMetadata[icon.properties.name] = iconMetadata;
  }
  exportJson(des_resolveTo("./bnicon.json"), bnIconMetadata);

  const name_ts_des_filepath = des_resolveTo("../bn-icon.name.ts");
  exportTs(
    name_ts_des_filepath,
    `export type $BnIconName =` +
      Object.keys(bnIconMetadata)
        .map(n => `"${n}"`)
        .join("|"),
  );
};

exports.doGenIcon = doGenIcon;

if (require.main === module) {
  doGenIcon(process.argv[2]);
}

import { setAssetPath, getAssetPath } from "@stencil/core";

class Assets {
  get(name: string) {
    return getAssetPath(name);
  }

  private _root: string = "";
  setRoot(root: string) {
    return (this._root = setAssetPath(root));
  }
  get root() {
    return this._root;
  }

  private _base = import.meta.url || location.href;
  parseRoot(path?: string | null) {
    return new URL(path || "", this._base).href;
  }
}

export const assets = new Assets();
/// 设置默认路径
console.log("DEFAULT_ASSET_PATH:", assets.setRoot(assets.parseRoot("./assets/")));

import { ImageTransform } from "../../utils/imageProvider";

namespace ImaginaryTransform {
  export type Config = {
    origin: string;
  };
}

const nullProtoObj = <T extends {}>(obj: T) => {
  Object.setPrototypeOf(obj, null);
  return obj;
};

const MODE_AND_PARAMS = nullProtoObj({
  crop: nullProtoObj({
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    force: "bool",
    rotate: "int",
    embed: "bool",
    norotation: "bool",
    noprofile: "bool",
    flip: "bool",
    flop: "bool",
    stripmeta: "bool",
    extend: "string",
    /** Example: '?background',250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    gravity: "string",
    /** Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
  } as const),
  smartcrop: nullProtoObj({
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    force: "bool",
    rotate: "int",
    embed: "bool",
    norotation: "bool",
    noprofile: "bool",
    flip: "bool",
    flop: "bool",
    stripmeta: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    gravity: "string",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
  } as const),
  resize: nullProtoObj({
    /** required */
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    rotate: "int",
    /** - Defaults to true */
    nocrop: "bool",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  extract: nullProtoObj({
    /** required */
    top: "int",
    left: "int",
    /** required */
    areawidth: "int",
    areaheight: "int",
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    rotate: "int",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  zoom: nullProtoObj({
    /** required */
    factor: "number",
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    rotate: "int",
    /** - Defaults to true */
    nocrop: "bool",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  thumbnail: nullProtoObj({
    /** required */
    width: "int",
    /** required */
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    rotate: "int",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  fit: nullProtoObj({
    /** required */
    width: "int",
    /** required */
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    rotate: "int",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  rotate: nullProtoObj({
    /** required */
    rotate: "int",
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  autorotate: nullProtoObj({
    /** required */ rotate: "int",
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  flip: nullProtoObj({
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  flop: nullProtoObj({
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  convert: nullProtoObj({
    /** required */
    type: "string",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    rotate: "int",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),
  watermark: nullProtoObj({
    /**required */
    text: "string",
    margin: "int",
    dpi: "int",
    textwidth: "int",
    opacity: "float",
    noreplicate: "bool",
    font: "string",
    color: "string",
    /**(JPEG-only) */
    quality: "int",
    /**(PNG-only) */
    compression: "int",
    type: "string",
    /**- Only GET method and if the -mount flag is present */
    file: "string",
    /**- Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    rotate: "int",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /**- Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /**- Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    palette: "bool",
  } as const),
  watermarkimage: nullProtoObj({
    /** required - URL to watermark image, example: ?image=https://logo-server.com/logo.jpg */
    image: "string",
    /** - Top position of the watermark image */
    top: "int",
    /** - Left position of the watermark image */
    left: "int",
    /** - Opacity value of the watermark image */
    opacity: "float",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    rotate: "int",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    sigma: "float",
    minampl: "float",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    palette: "bool",
  } as const),
  blur: nullProtoObj({
    /** required */
    sigma: "float",
    minampl: "float",
    width: "int",
    height: "int",
    /** (JPEG-only) */
    quality: "int",
    /** (PNG-only) */
    compression: "int",
    type: "string",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
    embed: "bool",
    force: "bool",
    norotation: "bool",
    noprofile: "bool",
    stripmeta: "bool",
    flip: "bool",
    flop: "bool",
    extend: "string",
    /** - Example: ?background=250,20,10 */
    background: "string",
    colorspace: "string",
    /** - Only POST and multipart/form payloads */
    field: "string",
    interlace: "bool",
    aspectratio: "string",
    palette: "bool",
  } as const),

  /**管道，聚合 */
  pipeline: nullProtoObj({
    /** required - URL safe encoded JSON with a list of operations. See below for interface details.
     * [
     *   {
     *     operation: "string", // Operation name identifier. Required.
     *     ignore_failure: "bool", // Ignore error in case of failure and continue with the next operation. Optional.
     *     params: "object", // Object defining operation specific image transformation params, same as supported URL query params per each endpoint.
     *   },
     * ]
     */
    operations: "json",
    /** - Only GET method and if the -mount flag is present */
    file: "string",
    /** - Only GET method and if the -enable-url-source flag is present */
    url: "string",
  }),
} as const);
export class ImaginaryTransform extends ImageTransform {
  constructor(readonly config: ImaginaryTransform.Config) {
    super();
  }
  transform(source_url: string, dataset: { [key: string]: unknown }) {
    const mode = String(dataset.mode);
    if (mode in MODE_AND_PARAMS === false) {
      return source_url;
    }
    const params = MODE_AND_PARAMS[mode as keyof typeof MODE_AND_PARAMS];
    const url = new URL("./" + mode, this.config.origin);
    for (const key in dataset) {
      if (key === "mode") {
        continue;
      }
      if (key in params) {
        let val = dataset[key];
        if (typeof val !== "string") {
          val = JSON.stringify(val);
        }
        url.searchParams.set(key, val as string);
      }
    }
    url.searchParams.set("url", source_url);

    return url.href;
  }
}

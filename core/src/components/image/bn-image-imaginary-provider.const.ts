import { ImageTransform } from "../../utils/imageProvider";
import { nullProtoObj } from "../../utils/utils";

namespace ImaginaryTransform {
  export type Config = {
    origin: string;
    redirection: { [from: string]: string };
  };
}

const PARAMS = {
  /** Width of image area to extract/resize */
  width: "int",
  /** Height of image area to extract/resize */
  height: "int",
  /** Top edge of area to extract. Example: 100 */
  top: "int",
  /** Left edge of area to extract. Example: 100 */
  left: "int",
  /** Height area to extract. Example: 300 */
  areawidth: "int",
  /** Width area to extract. Example: 300 */
  areaheight: "int",
  /** JPEG image quality between 1-100. Defaults to 80 */
  quality: "int",
  /** PNG compression level. Default: 6 */
  compression: "int",
  /** Enable 8-bit quantisation. Works with only PNG images. Default: false */
  palette: "bool",
  /** Image rotation angle. Must be multiple of 90. Example: 180 */
  rotate: "int",
  /** Zoom factor level. Example: 2 */
  factor: "int",
  /** Text area margin for watermark. Example: 50 */
  margin: "int",
  /** DPI value for watermark. Example: 150 */
  dpi: "int",
  /** Text area width for watermark. Example: 200 */
  textwidth: "int",
  /** Opacity level for watermark text or watermark image. Default: 0.2 */
  opacity: "float",
  /** 左右翻转，Transform the resultant image with flip operation. Default: false */
  flip: "bool",
  /** 上下翻转，Transform the resultant image with flop operation. Default: false */
  flop: "bool",
  /** Force image transformation size. Default: false */
  force: "bool",
  /** Disable crop transformation. Defaults depend on the operation */
  nocrop: "bool",
  /** Disable text replication in watermark. Defaults to false */
  noreplicate: "bool",
  /** Disable auto rotation based on EXIF orientation. Defaults to false */
  norotation: "bool",
  /** Disable adding ICC profile metadata. Defaults to false */
  noprofile: "bool",
  /** Remove original image metadata, such as EXIF metadata. Defaults to false */
  stripmeta: "bool",
  /** Watermark text content. Example: copyright (c) 2189 */
  text: "string",
  /** Watermark text font type and format. Example: sans bold 12 */
  font: "string",
  /** Watermark text RGB decimal base color. Example: 255,200,150 */
  color: "string",
  /** Watermark image URL pointing to the remote HTTP server. */
  image: "string",
  /** Specify the image format to output. Possible values are: jpeg, png, webp and auto. auto will use the preferred format requested by the client in the HTTP Accept header. A client can provide multiple comma-separated choices in Accept with the best being the one picked. */
  type: "string",
  /** Define the crop operation gravity. Supported values are: north, south, centre, west, east and smart. Defaults to centre. */
  gravity: "string",
  /** Use image from server local file path. In order to use this you must pass the -mount=<dir> flag. */
  file: "string",
  /** Fetch the image from a remote HTTP server. In order to use this you must pass the -enable-url-source flag. */
  url: "string",
  /** Use a custom color space for the output image. Allowed values are: srgb or bw (black&white) */
  colorspace: "string",
  /** Custom image form field name if using multipart/form. Defaults to: file */
  field: "string",
  /** Extend represents the image extend mode used when the edges of an image are extended. Defaults to mirror. Allowed values are: black, copy, mirror, white, lastpixel and background. If background value is specified, you can define the desired extend RGB color via background param, such as ?extend=background&background=250,20,10. For more info, see libvips docs. */
  extend: "string",
  /** Background RGB decimal base color to use when flattening transparent PNGs. Example: 255,200,150 */
  background: "string",
  /** Size of the gaussian mask to use when blurring an image. Example: 15.0 */
  sigma: "float",
  /** Minimum amplitude of the gaussian filter to use when blurring an image. Default: Example: 0.5 */
  minampl: "float",
  /** Pipeline of image operation transformations defined as URL safe encoded JSON array.
   *
   * [
   *   {
   *     operation: "string", // Operation name identifier. Required.
   *     ignore_failure: "bool", // Ignore error in case of failure and continue with the next operation. Optional.
   *     params: "object", // Object defining operation specific image transformation params, same as supported URL query params per each endpoint.
   *   },
   * ]
   */
  operations: "json",
  /** URL signature (URL-safe Base64-encoded HMAC digest) */
  sign: "string",
  /** Use progressive / interlaced format of the image output. Defaults to false */
  interlace: "bool",
  /** Apply aspect ratio by giving either image's height or width. Exampe: 16:9 */
  aspectratio: "string",
  embed: "bool",
} as const;

const toParams = <T extends ReadonlyArray<keyof typeof PARAMS>>(keys: T) => {
  const ps: any = {};
  for (const key of keys) {
    ps[key] = PARAMS[key];
  }
  ps.keys = keys;
  return nullProtoObj(ps) as Pick<typeof PARAMS, T[number]> & { keys: T };
};

const MODE_AND_PARAMS = nullProtoObj({
  crop: toParams([
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "force",
    "rotate",
    "embed",
    "norotation",
    "noprofile",
    "flip",
    "flop",
    "stripmeta",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "gravity",
    "field",
    "interlace",
    "aspectratio",
  ] as const),
  smartcrop: toParams([
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "force",
    "rotate",
    "embed",
    "norotation",
    "noprofile",
    "flip",
    "flop",
    "stripmeta",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "gravity",
    "field",
    "interlace",
    "aspectratio",
  ] as const),
  resize: toParams([
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "rotate",
    "nocrop",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  extract: toParams([
    "top",
    "left",
    "areawidth",
    "areaheight",
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "rotate",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  zoom: toParams([
    "factor",
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "rotate",
    "nocrop",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  thumbnail: toParams([
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "rotate",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  fit: toParams([
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "rotate",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  rotate: toParams([
    "rotate",
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  autorotate: toParams([
    "rotate",
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  flip: toParams([
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  flop: toParams([
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  convert: toParams([
    "type",
    "quality",
    "compression",
    "file",
    "url",
    "embed",
    "force",
    "rotate",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),
  watermark: toParams([
    /**required */
    "text",
    "margin",
    "dpi",
    "textwidth",
    "opacity",
    "noreplicate",
    "font",
    "color",
    /**(JPEG-only) */
    "quality",
    /**(PNG-only) */
    "compression",
    "type",
    /**- Only GET method and if the -mount flag is present */
    "file",
    /**- Only GET method and if the -enable-url-source flag is present */
    "url",
    "embed",
    "force",
    "rotate",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    /**- Example: ?background=250,20,10 */
    "background",
    "colorspace",
    "sigma",
    "minampl",
    /**- Only POST and multipart/form payloads */
    "field",
    "interlace",
    "palette",
  ] as const),
  watermarkimage: toParams([
    "image",
    "top",
    "left",
    "opacity",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "rotate",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "sigma",
    "minampl",
    "field",
    "interlace",
    "palette",
  ] as const),
  blur: toParams([
    "sigma",
    "minampl",
    "width",
    "height",
    "quality",
    "compression",
    "type",
    "file",
    "url",
    "embed",
    "force",
    "norotation",
    "noprofile",
    "stripmeta",
    "flip",
    "flop",
    "extend",
    "background",
    "colorspace",
    "field",
    "interlace",
    "aspectratio",
    "palette",
  ] as const),

  /**管道，聚合 */
  pipeline: toParams(["operations", "file", "url"] as const),
} as const);

export class ImaginaryTransform extends ImageTransform {
  constructor(readonly config: ImaginaryTransform.Config) {
    super();
  }
  private _redirect(src: string) {
    const redirection = this.config.redirection;
    for (const prefix in redirection) {
      if (src.startsWith(prefix)) {
        return src.replace(prefix, redirection[prefix]);
      }
    }
    return src;
  }
  transform(source_url: string, params: { [key: string]: unknown }, config: { pixelRatio: number }) {
    source_url = this._redirect(source_url);
    const mode = String(params.mode);
    if (mode in MODE_AND_PARAMS === false) {
      return source_url;
    }
    const MODE = MODE_AND_PARAMS[mode as keyof typeof MODE_AND_PARAMS];
    const PARAMS_KEYS = MODE.keys;
    const url = new URL("./" + mode, this.config.origin);
    for (const key of PARAMS_KEYS) {
      /// 目前禁用的字段
      if (key === "file" || "field" === key) {
        continue;
      }

      const val = params[key];
      if (val === undefined) {
        continue;
      }
      let valStr = typeof val !== "string" ? JSON.stringify(val) : val;

      const type = (MODE as any)[key];
      if (type === "int") {
        let valNum = +valStr;
        if (Number.isFinite(valNum) === false) {
          continue;
        }
        if (key === "width" || key === "height" || key === "textwidth") {
          valNum *= config.pixelRatio;
        }
        valStr = valNum.toString();
      }
      url.searchParams.set(key, valStr);
    }
    url.searchParams.set("url", source_url);
    debugger;
    return url.href;
  }
}

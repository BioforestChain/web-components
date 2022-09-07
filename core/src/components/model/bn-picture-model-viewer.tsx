import "@google/model-viewer";
import { ModelViewerElement } from "@google/model-viewer";
import { Component, ComponentInterface, Element, h, Host, Prop, State, Watch } from "@stencil/core";
import { assets } from "../../utils/assets";
import { Logger } from "../../utils/utils";
import { SlotChangeHelper } from "../util/slotChange.helper";
const MIME_MAP = {
  png: "image/png",
  webp: "image/webp",
  jpg: "image/jpeg",
  svg: "image/svg+xml",
};

const numsParser = (value: string, allowUnits: Set<string>, allowValues?: Set<string>) => {
  return value
    .split(/[\-\,\s\;]+/)
    .map(r => r.trim())
    .filter(r => {
      if (allowValues && allowValues.has(r)) {
        return true;
      }
      const num_unit = r.match(/(^[\d\.]+)([\w\W]+)/);
      if (num_unit === null) {
        return false;
      }
      const [_, num, unit] = num_unit;
      /// 如果不是正常的数字，解析异常
      if (parseFloat(num).toString() !== num) {
        return false;
      }
      /// 单位不对
      if (allowUnits.has(unit) === false) {
        return false;
      }
      return true;
    });
};
const CAMERA_ORBIT_RADIUS_UNITS = new Set(["m", "mm", "cm", "%"]);
const CAMERA_ORBIT_RADIUS_DEAFULT = "100%";

const FIELD_OF_VIEW_UNITS = new Set(["deg", "rad"]);
const FIELD_OF_VIEW_VALUES = new Set("auto");
const FIELD_OF_VIEW_DEFAULT = "auto";

/**默认启用交互提示 */
let defaultInteractionPrompt = true;

@Component({
  tag: "bn-picture-model-viewer",
  styleUrl: "bn-picture-model-viewer.scss",
  shadow: true,
  assetsDirs: ["./assets"],
})
export class BnPictureModelViewer implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  /**
   * image source
   */
  @Prop({ reflect: true }) readonly src!: string;
  @Watch("src")
  async watchSrc(src: string) {
    let mime: string | undefined | null;
    try {
      mime = this.src.startsWith("data:")
        ? // 如果是base64格式，直接从链接中获取mime
          this.src.match(/^data:([^\:]+);/)?.[1]
        : // 如果是链接的格式，尝试以文件后缀来获取mime
          Reflect.get(MIME_MAP, (new URL(src).pathname.split(".").pop() ?? "jpg").toLowerCase());

      if (mime === undefined) {
        /// 从response的头部中获取
        mime = await fetch(src).then(res => res.headers.get("content-type"));
      }
    } catch {}
    if (mime == undefined) {
      return;
    }

    const gltf2d_text = this.gltfSrc
      ? await fetch(this.gltfSrc).then(res => res.text())
      : await BnPictureModelViewer.gltf2d;

    this._model_src = URL.createObjectURL(
      new Blob(
        [
          gltf2d_text
            //
            .replace(/\{IMAGE_URL\}/g, this.src)
            //
            .replace(/\{IMAGE_MIME\}/, mime),
        ],
        {
          type: "application/json; charset=utf-8",
        },
      ),
    );
    this.console.log(src, "=>", this._model_src);
  }
  connectedCallback() {
    this.watchSrc(this.src);
    this.watchCameraOrbitRadius(this.cameraOrbitRadius);
    this.watchFieldOfView(this.fieldOfView);
    this.interactionPrompt = defaultInteractionPrompt;
  }
  componentDidLoad() {
    this._posterSlotChangeHelper.componentDidLoad();
  }
  disconnectedCallback() {
    this._posterSlotChangeHelper.disconnectedCallback();
  }

  /**
   * image alt
   */
  @Prop({ reflect: true }) readonly alt?: string;

  /**
   * .gltf 文件的链接，里头可以通过 {IMAGE_URL} 与 {IMAGE_MIME} 来匹配当前 src 所指向的图片
   */
  @Prop({}) readonly gltfSrc?: string;

  /**
   * model 3d view skybox image
   */
  @Prop({ reflect: true }) readonly skyboxImage?: string;
  /**
   * model 3d view environment image
   */
  @Prop({ reflect: true }) readonly environmentImage: string = "neutral";
  /**
   * for cors
   */
  @Prop({ reflect: true }) readonly withCredentials?: boolean;

  private static _gltf2d_text?: string | Promise<string>;
  static get gltf2d() {
    return (this._gltf2d_text ??= fetch(assets.get("./2d.gltf")).then(async res => {
      const binBlob = await fetch(assets.get("./2d.bin")).then(res => res.blob());
      const binBlobUrl = URL.createObjectURL(binBlob);
      return (this._gltf2d_text = (await res.text()).replace("{BIN_URL}", binBlobUrl));
    }));
  }

  @State()
  private _model_src?: string;

  /**
   * 相机轨道中有$theta $phi $radius三个属性，这个是距离属性
   * 格式为：$min-$default-$max
   * 可以为缩写成: $min($default)-$max
   * 或者：$min($default/$max)
   */
  @Prop({ reflect: true }) readonly cameraOrbitRadius?: string;
  @State() private _cameraOrbitRadius: readonly [string, string, string] = [
    CAMERA_ORBIT_RADIUS_DEAFULT,
    CAMERA_ORBIT_RADIUS_DEAFULT,
    CAMERA_ORBIT_RADIUS_DEAFULT,
  ] as const;
  @Watch("cameraOrbitRadius")
  watchCameraOrbitRadius(cameraOrbitRadius = CAMERA_ORBIT_RADIUS_DEAFULT) {
    const radius = numsParser(cameraOrbitRadius, CAMERA_ORBIT_RADIUS_UNITS);
    switch (radius.length) {
      case 0:
        radius.push(CAMERA_ORBIT_RADIUS_DEAFULT);
      case 1:
        radius.push(radius[0]);
      case 2:
        radius.unshift(radius[0]);
      default:
        this._cameraOrbitRadius = [radius[0], radius[1], radius[2]];
    }
  }

  /**
   * 相机的视角，如果 cameraOrbitRadius 设置得很大，可以通过调整 fieldOfView 来拉近它
   */
  @Prop({ reflect: true }) readonly fieldOfView?: string;
  @State() private _fieldOfView: readonly [string, string] = [FIELD_OF_VIEW_DEFAULT, FIELD_OF_VIEW_DEFAULT];
  @Watch("fieldOfView")
  watchFieldOfView(fieldOfView = FIELD_OF_VIEW_DEFAULT) {
    const fields = numsParser(fieldOfView, FIELD_OF_VIEW_UNITS, FIELD_OF_VIEW_VALUES);
    switch (fields.length) {
      case 0:
        fields.push(FIELD_OF_VIEW_DEFAULT);
      case 1:
        fields.push(fields[0]);
      default:
        this._fieldOfView = [fields[0], fields[1]];
    }
    return fields;
  }

  private _rotateTi?: any;
  @Prop({ reflect: true }) readonly autoRotate?: boolean;

  onCameraChange = (e: CustomEvent<{ source: string }>) => {
    if (e.detail.source !== "user-interaction") {
      return;
    }
    // 仅用了默认交互提示
    defaultInteractionPrompt = false;

    const modelViewer = e.target as ModelViewerElement;
    modelViewer.interpolationDecay = 50;
    if (this._rotateTi !== undefined) {
      clearTimeout(this._rotateTi);
      this._rotateTi = undefined;
    }

    this._rotateTi = setTimeout(() => {
      this._rotateTi = undefined;
      const { theta } = modelViewer.getCameraOrbit();
      const viewTheta = theta - modelViewer.turntableRotation;
      let toTheta = Math.round(viewTheta / Math.PI) * Math.PI;
      toTheta += modelViewer.turntableRotation;

      this.console.log("auto rotate", "from:", theta, "to:", toTheta);
      modelViewer.interpolationDecay = 200;
      modelViewer.cameraOrbit = `${toTheta}rad 95deg ${this._cameraOrbitRadius[1]}`;
    }, 200);
  };

  private _posterSlotChangeHelper = new SlotChangeHelper(this.hostEle, "poster").onToggle((hasEle, slotEle) => {
    this.console.log("has custom poster", hasEle);
    if (hasEle) {
      slotEle?.setAttribute("slot", "poster");
    } else {
      slotEle?.removeAttribute("slot");
    }
  });

  /**
   * 是否要显示交互提示
   * 这里默认的行为是，只要用户有过交互行为，那么在本次访问中，它就默认为false了
   */
  @Prop() interactionPrompt?: boolean;

  render() {
    const { autoRotate, _cameraOrbitRadius: radius, _fieldOfView: fields, interactionPrompt } = this;

    this.console.log("autoRotate:", autoRotate);
    this.console.log("cameraOrbitRadius:", radius);
    this.console.log("fieldOfView:", fields);

    return (
      <Host>
        <model-viewer
          alt={this.alt}
          src={this._model_src}
          skybox-image={this.skyboxImage}
          environment-image={this.environmentImage}
          poster={this.src}
          shadow-intensity="1"
          camera-controls
          auto-rotate={autoRotate}
          interaction-prompt={interactionPrompt ? "auto" : "non"}
          touch-actions="pan-y"
          min-camera-orbit={"-Infinity 90deg " + radius[0]}
          camera-orbit={"0deg 95deg " + radius[1]}
          max-camera-orbit={"Infinity 110deg " + radius[2]}
          min-field-of-view={fields[0]}
          max-field-of-view={fields[1]}
          interpolation-decay="20"
          oncamera-change={this.onCameraChange}
          with-credentials={this.withCredentials}
        >
          <slot name="poster"></slot>
        </model-viewer>
      </Host>
    );
  }
}

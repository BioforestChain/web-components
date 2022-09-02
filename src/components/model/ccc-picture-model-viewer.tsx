import "@google/model-viewer";
import { ModelViewerElement } from "@google/model-viewer";
import { Component, ComponentInterface, Element, getAssetPath, h, Host, Prop, State, Watch } from "@stencil/core";
import { Logger } from "../../utils/utils";
const MIME_MAP = {
  png: "image/png",
  webp: "image/webp",
  jpg: "image/jpeg",
  svg: "image/svg+xml",
};

@Component({
  tag: "ccc-picture-model-viewer",
  styleUrl: "ccc-picture-model-viewer.scss",
  shadow: true,
  assetsDirs: ["./assets"],
})
export class CccPictureModelViewer implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  /**
   * image source
   */
  @Prop({ reflect: true }) readonly src!: string;
  @Watch("src")
  async watchSrc() {
    const gltf2d_text = await CccPictureModelViewer.gltf2d;
    const mime =
      (this.src.startsWith("data:")
        ? this.src.match(/^data:([^\:]+);/)?.[1]
        : Reflect.get(MIME_MAP, (new URL(this.src).pathname.split(".").pop() ?? "jpg").toLowerCase())) ||
      // unknown
      MIME_MAP.jpg;

    this._model_src = URL.createObjectURL(
      new Blob([
        gltf2d_text
          //
          .replace("{IMAGE_URL}", this.src)
          //
          .replace("{IMAGE_MIME}", mime),
      ]),
    );
  }
  connectedCallback() {
    this.watchSrc();
  }

  /**
   * image alt
   */
  @Prop({ reflect: true }) readonly alt!: string;

  /**
   * model 3d view skybox image
   */
  @Prop({ reflect: true }) readonly skyboxImage!: string;

  private static _gltf2d_text?: string | Promise<string>;
  static get gltf2d() {
    return (this._gltf2d_text ??= fetch(getAssetPath("./assets/2d.gltf")).then(async res => {
      const binBlob = await fetch(getAssetPath("./assets/2d.bin")).then(res => res.blob());
      const binBlobUrl = URL.createObjectURL(binBlob);
      return (this._gltf2d_text = (await res.text()).replace("{BIN_URL}", binBlobUrl));
    }));
  }

  @State()
  private _model_src?: string;

  private _rotateTi?: any;

  onCameraChange = (e: CustomEvent<{ source: string }>) => {
    if (e.detail.source !== "user-interaction") {
      return;
    }
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
      modelViewer.cameraOrbit = `${toTheta}rad 95deg 50m`;
    }, 200);
  };

  render() {
    return (
      <Host>
        <model-viewer
          alt={this.alt}
          src={this._model_src}
          skybox-image={this.skyboxImage}
          poster={this.src}
          shadow-intensity="1"
          camera-controls
          auto-rotate
          touch-actions="pan-y"
          camera-orbit="0deg 95deg 50m"
          max-camera-orbit="Infinity 110deg 55m"
          min-camera-orbit="-Infinity 90deg 45m"
          min-field-of-view="40deg"
          max-field-of-view="50deg"
          interpolation-decay="20"
          oncamera-change={this.onCameraChange}
        ></model-viewer>
      </Host>
    );
  }
}

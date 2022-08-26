import "@google/model-viewer";
import { Component, ComponentInterface, Element, getAssetPath, h, Host, Prop, State, Watch } from "@stencil/core";
import { Logger } from "../../utils/utils";

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
    this._model_src = URL.createObjectURL(new Blob([gltf2d_text.replace("texture/2dp-1.png", this.src)]));
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
      return (this._gltf2d_text = (await res.text()).replace("2d.bin", binBlobUrl));
    }));
  }

  @State()
  private _model_src?: string;

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
          touch-actions="pan-y"
        ></model-viewer>
      </Host>
    );
  }
}

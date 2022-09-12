import { Component, ComponentInterface, Element, h, Host, Method } from "@stencil/core";
import { Logger } from "../../utils/utils";
import { once } from "../util/event.helper";
import { QueryHelper } from "../util/query.helper";
import { ResizeHelper } from "../util/resize.helper";
import { SlotChangeHelper } from "../util/slotChange.helper";

/**
 * 图片的容器，将图片cover的模式放置到容器中，容器如果有额外的空间，那么会被
 */
@Component({
  tag: "bn-blur-ground-image",
  styleUrl: "bn-blur-ground-image.scss",
  shadow: true,
})
export class BnBlurdGroundImage implements ComponentInterface {
  @Element() hostEle!: HTMLElement;
  readonly console = new Logger(this.hostEle);

  private _canvasEle!: HTMLCanvasElement;
  private _canvas2dCtx!: CanvasRenderingContext2D;
  private _canvasQueryHelper = new QueryHelper<HTMLCanvasElement>(this.hostEle, "canvas").onFoundOne(canvasEle => {
    this._canvasEle = canvasEle;
    this._canvas2dCtx = canvasEle.getContext("2d")!;
    if ("filter" in this._canvas2dCtx === false) {
      console.warn(
        "no support `CanvasRenderingContext2d.filter` in your browser. add polyfill in your context! eg: https://github.com/davidenke/context-filter-polyfill",
      );
    }
  });
  private _sourceImgEle?: HTMLImageElement;
  private _imgSlotHelper = new SlotChangeHelper(this.hostEle, "img").onChange(eles => {
    this._sourceImgEle = eles.findByTagName("img");
    this._drawCanvas();
  });

  private async _drawCanvas() {
    const imgEle = this._sourceImgEle;
    const { _canvasEle: canvas, _canvas2dCtx: ctx } = this;
    if (imgEle) {
      if (imgEle.complete === false) {
        await once(imgEle, "load", "error");
      }
      /// 图片如果已经变更，就意味着失去了控制权
      if (imgEle !== this._sourceImgEle) {
        return;
      }
      const { naturalWidth, naturalHeight } = imgEle;
      const naturalAspectRatio = naturalWidth / naturalHeight;

      const canvasMax_width = this.hostEle.clientWidth * devicePixelRatio;
      const canvasMax_height = this.hostEle.clientHeight * devicePixelRatio;
      const canvasMax_AspectRatio = canvasMax_width / canvasMax_height;

      let imageScale: number;
      /// 如果canvasMax的衡宽比相比natural的更大，说明更宽，那么挑选一个最小高度
      if (canvasMax_AspectRatio > naturalAspectRatio) {
        canvas.height = Math.min(canvasMax_height, naturalHeight);
        canvas.width = canvas.height * canvasMax_AspectRatio;
        imageScale = canvas.height / naturalHeight;
      } else {
        canvas.width = Math.min(canvasMax_width, naturalWidth);
        canvas.height = canvas.width / canvasMax_AspectRatio;
        imageScale = canvas.width / naturalWidth;
      }

      /// 绘制模糊背景
      const blurSize = Math.sqrt(naturalWidth ** 2 + naturalHeight ** 2) * imageScale * 0.1;
      ctx.filter = `blur(${blurSize * imageScale}px)`;
      ctx.drawImage(
        imgEle,
        // 因为blur会有白边，所以这里额外绘制了blurSize来隐藏白边
        -blurSize,
        -blurSize,
        canvas.width + (blurSize << 1),
        canvas.height + (blurSize << 1),
      );
      /// 以cover的模式绘制图片
      const imageWidth = naturalWidth * imageScale;
      const imageHeight = naturalHeight * imageScale;
      const dx = canvas.width / 2 - imageWidth / 2;
      const dy = canvas.height / 2 - imageHeight / 2;
      ctx.filter = "none";
      ctx.drawImage(imgEle, dx, dy, imageWidth, imageHeight);

      this.console.log(canvas.width, canvas.height, blurSize);
    } else {
      canvas.width = 1;
      canvas.height = 1;
      ctx.clearRect(0, 0, 1, 1);
    }
  }

  @Method()
  async getActiveImageElement() {
    return this._sourceImgEle;
  }

  private _resizeHelper = new ResizeHelper().on(this.hostEle, {
    resize: () => {
      this.console.log("resize");
      this._drawCanvas();
    },
  });

  @Method()
  async toBlob(type?: string, quality?: any) {
    return new Promise<Blob>((resolve, reject) =>
      this._canvasEle.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject();
          }
        },
        type,
        quality,
      ),
    );
  }

  @Method()
  async toDataURL(type?: string, quality?: any) {
    return this._canvasEle.toDataURL(type, quality);
  }

  componentDidLoad() {
    /// 先初始化画布
    this._canvasQueryHelper.componentDidLoad();
    /// 查询元素
    this._imgSlotHelper.componentDidLoad();

    this._resizeHelper.componentDidLoad();
  }
  disconnectedCallback() {
    this._imgSlotHelper.disconnectedCallback();
    this._resizeHelper.disconnectedCallback();
  }
  render() {
    return (
      <Host>
        <div class="background">
          <canvas></canvas>
          <slot name="img"></slot>
        </div>
        {/* <slot></slot> */}
      </Host>
    );
  }
}

export class EventBindingHelper {
  constructor(
    readonly hostEle: HTMLElement,
    readonly target: EventTarget,
    readonly eventname: string,
    readonly hanlder: EventListener,
  ) {}

  private _binded = false;
  bind() {
    if (this._binded) {
      return;
    }
    this._binded = true;
    this.target.addEventListener(this.eventname, this.hanlder);
  }
  unbind() {
    if (this._binded === false) {
      return;
    }
    this._binded = false;
    this.target.removeEventListener(this.eventname, this.hanlder);
  }
}

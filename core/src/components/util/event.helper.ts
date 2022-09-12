import { PromiseOut } from "../../utils/utils";

export async function* on<T = Event>(ele: EventTarget, eventName: string) {
  let waitter: PromiseOut<void> | undefined;
  const eventList: T[] = [];
  ele.addEventListener(eventName, event => {
    eventList.push(event as unknown as T);
    if (waitter) {
      waitter.resolve();
    }
  });
  while (true) {
    for (const event of eventList) {
      yield event;
    }
    eventList.length = 0;
    await (waitter = new PromiseOut()).promise;
    waitter = undefined;
  }
}
export const once = <T = Event>(ele: EventTarget, eventName: string, rejectEventName?: string) => {
  const r = new PromiseOut<T>();

  const onResolve = (event: Event) => {
    r.resolve(event as unknown as T);
    off?.();
  };
  const onReject =
    rejectEventName !== undefined
      ? (event: Event) => {
          r.reject(event);
          off!();
        }
      : undefined;

  const off =
    onReject !== undefined
      ? () => {
          ele.removeEventListener(eventName, onResolve);
          ele.removeEventListener(rejectEventName!, onReject!);
        }
      : undefined;

  ele.addEventListener(eventName, onResolve, { once: true });
  if (onReject !== undefined) {
    ele.addEventListener(rejectEventName!, onReject!, { once: true });
  }

  return r.promise;
};

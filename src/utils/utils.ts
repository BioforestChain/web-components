export function format(first: string, middle: string, last: string): string {
  return (first || "") + (middle ? ` ${middle}` : "") + (last ? ` ${last}` : "");
}
/**存储已经执行过bindThis的属性，避免原型链上的重复bind */
const BINDED_THIS_PROPS = Symbol("bindThisProps");
export function bindThis<T extends Function>(
  _target: object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void {
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
  }

  return {
    configurable: true,
    get(this: T & { [BINDED_THIS_PROPS]?: Set<string> }): T {
      let props = this[BINDED_THIS_PROPS];
      /// 父级原型链上已经有执行过bindThis了，这里就直接跟随父级进行返回
      if (props && props.has(propertyKey)) {
        return descriptor.value!;
      }

      const bound: T = descriptor.value!.bind(this);

      Object.defineProperty(this, propertyKey, {
        value: bound,
        configurable: true,
        writable: true,
      });
      props ||= this[BINDED_THIS_PROPS] = new Set();
      props.add(propertyKey);

      return bound;
    },
  };
}

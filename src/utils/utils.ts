/**存储已经执行过bindThis的属性，避免原型链上的重复bind */
const BINDED_THIS_PROPS = Symbol("bindThisProps");
export function bindThis<T extends Function>(
  _target: object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void {
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new TypeError(`Only methods can be decorated with @bindThis. <${propertyKey}> is not a method!`);
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

const CACHE_KEYS_SYMBOL = Symbol("CACHE_GETTER_KEYS_STORE");
function getCacheKeys(protoTarget: object) {
  let CACHE_KEYS = Reflect.get(protoTarget, CACHE_KEYS_SYMBOL);
  if (!CACHE_KEYS) {
    CACHE_KEYS = new Map<PropertyKey, symbol>();
    /// 写入原型链
    Reflect.set(protoTarget, CACHE_KEYS_SYMBOL, CACHE_KEYS);
  }
  return CACHE_KEYS;
}
/**
 * 缓存Key生成器，这里与构造函数的原型链进行绑定
 * 以确保构造函数存在的清空下，缓存的key就会有存在的必要。
 * 这样可以避免动态生成class的情况，但这些class被释放，那么对应的CACHE_KEYS也能被释放
 *
 * 值得注意的是，根据代码的执行顺序，这里只会绑定到最底层的那么class上，其它继承于它的class与它贡献同一个CACHE_KEYS
 */
function keyGenerator(protoTarget: object, prop: PropertyKey) {
  const CACHE_KEYS = getCacheKeys(protoTarget);
  let symbol = CACHE_KEYS.get(prop);
  if (!symbol) {
    symbol = Symbol(`[${typeof prop}]${String(prop)}`);
    CACHE_KEYS.set(prop, symbol);
  }
  return symbol;
}

type CacheValue<T = unknown, K extends keyof T = keyof T> = {
  // propTarget: T;
  target: T;
  value: K;
  sourceFun: () => T[K];
};

export function cacheGetter(propTarget: any, prop: PropertyKey, descriptor: PropertyDescriptor) {
  if (typeof descriptor.get !== "function") {
    throw new TypeError(`property ${String(prop)} must has an getter function.`);
  }
  const source_fun = descriptor.get;
  /**缓存结果用的key */
  const CACHE_VALUE_SYMBOL = keyGenerator(propTarget, prop);

  const getter = function (this: any) {
    if (CACHE_VALUE_SYMBOL in this) {
      // 可能无法成功 Object.defineProperty，那么直接获取缓存的数据
      return this[CACHE_VALUE_SYMBOL].value;
    } else {
      const value = source_fun.call(this);
      /**
       * 使用原型链来进行缓存绑定，最符合使用直觉
       * 同时这里需要记录原型链中的位置，才能快速删除
       */
      const cacheValue: CacheValue<any> = {
        // propTarget,
        target: this,
        value,
        sourceFun: source_fun,
      };
      this[CACHE_VALUE_SYMBOL] = cacheValue;

      /// 如果没有自定义getter，那么可以尝试进行重写，直接写成值，无需再是函数的模式
      if (descriptor.set === undefined) {
        try {
          /// 注意，这里不会修改到 propTarget 对象，所以不干扰其它实例
          Object.defineProperty(this, prop, {
            value,
            writable: false,
            configurable: true,
            enumerable: descriptor.enumerable,
          });
        } catch (err) {
          console.error(err);
        }
      }
      return value;
    }
  };

  Reflect.set(getter, "source_fun", source_fun);
  descriptor.get = getter;
  return descriptor;
}

export function cleanGetterCache<T extends object>(target: T, prop: keyof T) {
  const CACHE_KEYS = getCacheKeys(target);

  /// 如果不存在缓存用的key，那么根本就没有这个getter，直接当作清理成功
  if (CACHE_KEYS.has(prop) === false) {
    return true;
  }
  /**获取用于保存缓存的key */
  const CACHE_VALUE_SYMBOL = CACHE_KEYS.get(prop);

  return _cleanGetterCache(target, prop, CACHE_VALUE_SYMBOL);
}

export function cleanAllGetterCache<T extends object>(target: T) {
  const CACHE_KEYS = getCacheKeys(target);
  for (const [prop, symbol] of CACHE_KEYS) {
    _cleanGetterCache(target, prop, symbol);
  }
}

function _cleanGetterCache<T extends object>(target: T, prop: keyof T, CACHE_VALUE_SYMBOL: symbol) {
  /// 如果没有找到缓存的值，那么无需处理
  const cacheValue: CacheValue<T> = Reflect.get(target, CACHE_VALUE_SYMBOL);
  if (cacheValue === undefined) {
    return true;
  }

  /// 如果已经有缓存的值，那么尝试进行清除
  if (Reflect.deleteProperty(cacheValue.target, CACHE_VALUE_SYMBOL) === false) {
    return false;
  }

  /// 清除缓存后，清理可能在实例上写过"值模式"
  Reflect.deleteProperty(cacheValue.target, prop);
  return true;
}

type InnerFinallyArg<T> =
  | {
      readonly status: "resolved";
      readonly result: T;
    }
  | {
      readonly status: "rejected";
      readonly reason?: unknown;
    };
type InnerFinally<T> = (arg: InnerFinallyArg<T>) => unknown;
type InnerThen<T> = (result: T) => unknown;
type InnerCatch = (reason?: unknown) => unknown;
export class PromiseOut<T = unknown> {
  promise: Promise<T>;
  is_resolved = false;
  is_rejected = false;
  is_finished = false;
  value?: T;
  reason?: unknown;
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: (reason?: unknown) => void;
  private _innerFinally?: InnerFinally<T>[];
  private _innerFinallyArg?: InnerFinallyArg<T>;

  private _innerThen?: InnerThen<T>[];
  private _innerCatch?: InnerCatch[];

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = async (value: T | PromiseLike<T>) => {
        try {
          this.is_resolved = true;
          this.is_finished = true;
          resolve((this.value = await value));
          this._runThen();
          this._innerFinallyArg = Object.freeze({ status: "resolved", result: this.value });
          this._runFinally();
        } catch (err) {
          this.reject(err);
        }
      };
      this.reject = (reason?: unknown) => {
        this.is_rejected = true;
        this.is_finished = true;
        reject((this.reason = reason));
        this._runCatch();
        this._innerFinallyArg = Object.freeze({ status: "rejected", reason: this.reason });
        this._runFinally();
      };
    });
  }
  onSuccess(innerThen: InnerThen<T>) {
    if (this.is_resolved) {
      this.__callInnerThen(innerThen);
    } else {
      (this._innerThen || (this._innerThen = [])).push(innerThen);
    }
  }
  onError(innerCatch: InnerCatch) {
    if (this.is_rejected) {
      this.__callInnerCatch(innerCatch);
    } else {
      (this._innerCatch || (this._innerCatch = [])).push(innerCatch);
    }
  }
  onFinished(innerFinally: () => unknown) {
    if (this.is_finished) {
      this.__callInnerFinally(innerFinally);
    } else {
      (this._innerFinally || (this._innerFinally = [])).push(innerFinally);
    }
  }
  private _runFinally() {
    if (this._innerFinally) {
      for (const innerFinally of this._innerFinally) {
        this.__callInnerFinally(innerFinally);
      }
      this._innerFinally = undefined;
    }
  }
  private __callInnerFinally(innerFinally: InnerFinally<T>) {
    queueMicrotask(async () => {
      try {
        await innerFinally(this._innerFinallyArg!);
      } catch (err) {
        console.error("Unhandled promise rejection when running onFinished", innerFinally, err);
      }
    });
  }
  private _runThen() {
    if (this._innerThen) {
      for (const innerThen of this._innerThen) {
        this.__callInnerThen(innerThen);
      }
      this._innerThen = undefined;
    }
  }
  private _runCatch() {
    if (this._innerCatch) {
      for (const innerCatch of this._innerCatch) {
        this.__callInnerCatch(innerCatch);
      }
      this._innerCatch = undefined;
    }
  }
  private __callInnerThen(innerThen: InnerThen<T>) {
    queueMicrotask(async () => {
      try {
        await innerThen(this.value!);
      } catch (err) {
        console.error("Unhandled promise rejection when running onSuccess", innerThen, err);
      }
    });
  }
  private __callInnerCatch(innerCatch: InnerCatch) {
    queueMicrotask(async () => {
      try {
        await innerCatch(this.value!);
      } catch (err) {
        console.error("Unhandled promise rejection when running onError", innerCatch, err);
      }
    });
  }
}

export function microtaskQueue<T extends Function>(
  _target: object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void {
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new TypeError(`Only methods can be decorated with @microtaskQueue. <${propertyKey}> is not a method!`);
  }
  const sourceFun = descriptor.value;
  let runned: PromiseOut<unknown> | undefined;
  const newFun = function (this: any, ...args: unknown[]) {
    if (runned === undefined) {
      runned = new PromiseOut();
      queueMicrotask(() => {
        try {
          runned!.resolve(sourceFun.apply(this, args));
        } catch (err) {
          runned!.reject(err);
        }
        runned = undefined;
      });
    }
    return runned.promise;
  };
  descriptor.value = newFun as unknown as T;

  return descriptor;
}

type DomQueryer = Document | Element | DocumentFragment;

export const querySelectorAll = <T>(root: DomQueryer | null | undefined, selector: string) => {
  return Array.prototype.slice.call(root?.querySelectorAll(selector) ?? { length: 0 }) as T[];
};

export const querySelector = <T>(root: DomQueryer | null | undefined, selector: string) => {
  return (root?.querySelector(selector) || undefined) as T | undefined;
};

export const at = <T>(arr: T[], index: number, floor?: boolean) => {
  index = index % arr.length;
  index;
  index = index < 0 ? index + arr.length : index;
  if (floor) {
    index = Math.floor(index);
  }

  return arr[index];
};

export const enum LOGGER_LEVEL {
  /// 启用全部
  enable,
  debug,
  info,
  warn,
  error,
  success,
  /// 禁用全部
  disable,
}
export class Logger {
  constructor(private hostEle: HTMLElement) {}
  private _tagName = this.hostEle.tagName.toLocaleLowerCase();
  private _tagInfo = this._tagName + ":";
  private _getLogLevel() {
    switch (this.hostEle.dataset.cccDebug) {
      case undefined:
        const globalCccDebug = localStorage.getItem("ccc-debug");
        if (globalCccDebug === "*" || globalCccDebug?.split(/[,\s]+/).includes(this._tagName)) {
          return LOGGER_LEVEL.enable;
        }
        return LOGGER_LEVEL.disable;
      case "enable":
        return LOGGER_LEVEL.enable;
      case "debug":
        return LOGGER_LEVEL.debug;
      case "info":
        return LOGGER_LEVEL.info;
      case "warn":
        return LOGGER_LEVEL.warn;
      case "error":
        return LOGGER_LEVEL.error;
      case "success":
        return LOGGER_LEVEL.success;
      case "disable":
        return LOGGER_LEVEL.disable;
    }
    return LOGGER_LEVEL.disable;
  }
  isEnable(level: LOGGER_LEVEL) {
    return this._getLogLevel() <= level;
  }
  debug(...args: unknown[]) {
    if (this.isEnable(LOGGER_LEVEL.debug)) {
      console.debug("%c" + this._tagInfo, "color:grey", ...args);
    }
  }
  log(...args: unknown[]) {
    if (this.isEnable(LOGGER_LEVEL.debug)) {
      console.debug("%c" + this._tagInfo, "color:grey", ...args);
    }
  }
  info(...args: unknown[]) {
    if (this.isEnable(LOGGER_LEVEL.info)) {
      console.info(this._tagInfo, ...args);
    }
  }
  warn(...args: unknown[]) {
    if (this.isEnable(LOGGER_LEVEL.warn)) {
      console.warn(this._tagInfo, ...args);
    }
  }
  error(...args: unknown[]) {
    if (this.isEnable(LOGGER_LEVEL.error)) {
      console.error(this._tagInfo, ...args);
    }
  }
  success(...args: unknown[]) {
    if (this.isEnable(LOGGER_LEVEL.success)) {
      console.log("%c" + this._tagInfo, "color:green", ...args);
    }
  }
}

export const cssAnimationDurationToMs = (animationDuration: string) => {
  let ms = 0;
  const num = parseFloat(animationDuration);
  if (animationDuration.endsWith("ms")) {
    ms = num;
  } else if (animationDuration.endsWith("s")) {
    ms = num * 1000;
  } else {
    ms = parseFloat(animationDuration) || 0;
  }
  return ms;
};

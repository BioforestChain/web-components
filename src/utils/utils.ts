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
/*
// node .\packages\decorator\build\cjs\cacheGetter.js
class A {
  b = 1;
  @cacheGetter
  get a() {
    return this.b;
  }
}
const a = new A();
a.b = 2;
console.assert(a.a === 2);
a.b = 3;
console.assert(a.a === 2);

cleanGetterCache(a, "a");
console.assert(a.a === 3);

a.b = 4;

const a1 = Object.create(a);
console.assert(a1.a === 3);
cleanGetterCache(a1, "a");
console.assert(a1.a === 4);
a.b = 5;
console.assert(a1.a === 4);
console.assert(a.a === 5);
 */

export const querySelectorAll = <T>(root: Element | DocumentFragment | null | undefined, selector: string) => {
  return Array.prototype.slice.call(root?.querySelectorAll(selector) ?? { length: 0 }) as T[];
};

export const querySelector = <T>(root: Element | DocumentFragment | null | undefined, selector: string) => {
  return root?.querySelector(selector) as T | null;
};

import { HTMLTemplateResult, render } from 'lit-html';
import type { ArgTypes, Conditional } from '@storybook/csf';
// export const defineArgsType = () => {};
export const defineStory = <T>(
  tpl: (args: Partial<T>) => HTMLTemplateResult,
  defaultArgs?: Partial<T>
) => {
  const Tpl = Object.assign(
    (args: Partial<T>) => {
      const wrapper = document.createElement('div');
      render(tpl(args), wrapper);
      return wrapper;
    },
    {
      args: defaultArgs,
    }
  );
  return Tpl;
};

type DefineArgOptions<V> = {
  name?: string;
  description?: string;
  defaultValue?: V;
  if?: Conditional;
};

export class ArgFactory<T> {
  private argTypes = {} as ArgTypes<T>;
  private args = {} as T;
  private _setOpts(key: string, base: object, opts?: DefineArgOptions<any>) {
    if (opts) {
      this.argTypes[key] = {
        name: opts.name,
        description: opts.description,
        defaultValue: opts.defaultValue,
        if: opts.if,
        ...base,
      };
      if (opts.defaultValue != undefined) {
        this.args[key] = opts.defaultValue;
      }
    } else {
      this.argTypes[key] = base;
    }
  }
  defineBoolean<K extends keyof T & string>(key: K, opts?: DefineArgOptions<boolean>) {
    this._setOpts(key, { type: 'boolean' }, opts);
    return this;
  }
  defineString<K extends keyof T & string>(key: K, opts?: DefineArgOptions<boolean>) {
    this._setOpts(key, { type: 'string' }, opts);
    return this;
  }
  defineNumber<K extends keyof T & string>(key: K, opts?: DefineArgOptions<number>) {
    this._setOpts(key, { type: 'number' }, opts);
    return this;
  }
  defineAction<K extends keyof T & string>(key: K, opts?: DefineArgOptions<Function>) {
    this._setOpts(
      key,
      { action: key.toString().replace(/^on([A-Z])/, (_, c) => c.toLowerCase()) },
      opts
    );
    return this;
  }
  defineEnum<K extends keyof T & string, O extends string>(
    key: K,
    options: O[],
    opts?: DefineArgOptions<O>
  ) {
    this._setOpts(key, { options, control: 'select' }, opts);
    return this;
  }
  toArgTypes() {
    return { ...this.argTypes };
  }
  toArgs(mixinArgs?: T) {
    return { ...this.args, ...mixinArgs };
  }
}

import type { ArgTypes, Conditional, InputType } from "@storybook/csf";
import { HTMLTemplateResult, render } from "lit-html";
// import { SBScalarType } from "@storybook/client-api";
// export const defineArgsType = () => {};
export const defineStory = <T, E extends HTMLElement = HTMLElement>(
  tpl: (args: Partial<T>) => HTMLTemplateResult,
  defaultArgs?: Partial<T>,
) => {
  const onMountCbs: Array<(frag: DocumentFragment, ele: E) => void> = [];
  const cssTexts: Array<string> = [];
  const htmlTpls: Array<{ tpl: HTMLTemplateResult; pos: "before" | "after" }> = [];
  const Tpl = Object.assign(
    (args: Partial<T>) => {
      const wrapper = document.createDocumentFragment();
      render(tpl(args), wrapper);
      const ele = wrapper.firstElementChild as unknown as E;

      for (const cssText of cssTexts) {
        const styleEle = document.createElement("style");
        styleEle.innerHTML = cssText;
        wrapper.appendChild(styleEle);
      }
      for (const { tpl, pos } of htmlTpls) {
        const f = document.createDocumentFragment();
        render(tpl, f);
        if (pos == "after") {
          wrapper.appendChild(f);
        } else if (pos == "before") {
          wrapper.insertBefore(f, ele);
        }
      }

      for (const onMount of onMountCbs) {
        onMount(wrapper, ele);
      }
      return wrapper;
    },
    {
      args: defaultArgs,
      onMount(cb: typeof onMountCbs[0]) {
        onMountCbs.push(cb);
        return Tpl;
      },
      addStyle(cssText: string) {
        cssTexts.push(cssText);
        return Tpl;
      },
      addHtmlTpl(tpl: HTMLTemplateResult, pos: "before" | "after" = "after") {
        htmlTpls.push({ tpl, pos });
        return Tpl;
      },
      clone(args?: Partial<T>) {
        const Tpl = defineStory<T, E>(tpl, { ...defaultArgs, ...args });
        for (const css of cssTexts) {
          Tpl.addStyle(css);
        }
        for (const htmlTpl of htmlTpls) {
          Tpl.addHtmlTpl(htmlTpl.tpl, htmlTpl.pos);
        }
        for (const cb of onMountCbs) {
          Tpl.onMount(cb);
        }
        return Tpl;
      },
    },
  );
  return Tpl;
};

type DefineArgOptions<V> = {
  name?: string;
  description?: string;
  defaultValue?: V;
  if?: Conditional;
  required?: boolean;
};

export class ArgFactory<T> {
  private argTypes = {} as ArgTypes<T>;
  private args = {} as T;
  private _setOpts(key: string, base: Partial<InputType>, opts?: DefineArgOptions<any>) {
    let argType: InputType = base;
    if (opts) {
      argType = {
        name: opts.name,
        description: opts.description,
        if: opts.if,
        ...base,
      };
      if (opts.defaultValue != undefined) {
        this.args[key] = opts.defaultValue;
      }
      if (opts.required === false) {
        argType.type =
          typeof argType.type === "string"
            ? { name: argType.type, required: false }
            : ({ ...argType.type, required: false } as any);
      }
    }
    this.argTypes[key] = argType;
  }
  defineBoolean<K extends keyof T & string>(key: K, opts?: DefineArgOptions<boolean>) {
    this._setOpts(key, { type: "boolean" }, opts);
    return this;
  }
  defineString<K extends keyof T & string>(key: K, opts?: DefineArgOptions<string>) {
    this._setOpts(key, { type: "string" }, opts);
    return this;
  }
  defineNumber<K extends keyof T & string>(key: K, opts?: DefineArgOptions<number>) {
    this._setOpts(key, { type: "number" }, opts);
    return this;
  }
  defineObject<K extends keyof T & string>(key: K, opts?: DefineArgOptions<object>) {
    this._setOpts(key, { type: { name: "object", value: {} } }, opts);
    return this;
  }
  defineArray<K extends keyof T & string>(key: K, opts?: DefineArgOptions<object>) {
    this._setOpts(key, { type: { name: "array", value: { name: "other", value: "any" } } }, opts);
    return this;
  }
  defineAction<K extends keyof T & string>(key: K, opts?: DefineArgOptions<Function>) {
    this._setOpts(key, { action: key.toString().replace(/^on([A-Z])/, (_, c) => c.toLowerCase()) }, opts);
    return this;
  }
  defineEnum<K extends keyof T & string, O extends unknown>(key: K, options: O[], opts?: DefineArgOptions<O>) {
    this._setOpts(key, { options, control: "select" }, opts);
    return this;
  }
  toArgTypes() {
    return { ...this.argTypes };
  }
  toArgs(mixinArgs?: Partial<T>) {
    return { ...this.args, ...mixinArgs };
  }
}

import { build } from "./htm.js";
import { h as superfine_h, text, patch } from "./superfine.js";
import { Mini } from "./mini.js";
import { sharedUpdate } from "./shared-update.js";

/** @typedef {object} VNode */

/**
 * A wrapper around superfine's `h` and `text` functions and returns a more JSX
 * friendly `h` function that can be used with `htm`.
 * @param {string|function} type
 * @param {object} props
 * @param {any[]} children
 * @return {VNode}
 */
export const h = (type, props, ...children) =>
  typeof type === "function"
    ? type(props, children)
    : superfine_h(
        type,
        props || {},
        []
          .concat(...children)
          .map((x) =>
            typeof x === "string" || typeof x === "number" ? text(x) : x
          )
      );

export const html =
  /** @type {(strings: TemplateStringsArray, ...values: any[]) => VNode | VNode[]} */ (
    build.bind(h)
  );

/** @type { <S, V>(init: S, view: (state: S) => V, node: HTMLElement | null) => Mini<S, V>} */
export const miniApp = Mini.app(patch, sharedUpdate);
export { Mini };

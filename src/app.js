import { parse } from "../lib/hyperlit.js";
import { h, text, patch } from "../lib/hyperapp-mini.js";
import { mini } from "../lib/mini.js";
import { State } from "./state.js";
import { main } from "./main.js";

const html = parse({h, text});

const dispatch = mini(new State(), main, document.getElementById("root"), patch);

/** @param {(event: Event, state: State) => void} f */
function eventHandler(f) {
  return (/** @type {Event} */ event) =>
    dispatch((state) => {
      f(event, state);
    });
}

export { html, dispatch, eventHandler, State };

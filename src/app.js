import {
  miniApp,
  html,
} from "../lib/mini-htm-superfine-sharedupdate.js";
import { State } from "./state.js";
import { main } from "./main.js";

let cachedMini = null;
function mini() {
  if (cachedMini) {
    return cachedMini;
  }
  cachedMini = miniApp(new State(), main, document.getElementById("root"));
  return cachedMini;
}

  /** @param {(event: Event, state: S) => void} f */
export function eventHandler(f) {
  return (/** @type {Event} */ event) => {
    mini().dispatch((state) => {
      f(event, state);
    });
  };
}
mini();
export { mini, html };

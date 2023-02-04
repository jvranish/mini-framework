import { miniApp, html } from "../lib/mini-htm-superfine-sharedupdate.js";
import { State } from "./state.js";
import { main } from "./main.js";

const mini = miniApp(new State(), main, document.getElementById("root"));

/** @param {(event: Event, state: State) => void} f */
function eventHandler(f) {
  return (/** @type {Event} */ event) =>
    mini.dispatch((state) => {
      f(event, state);
    });
}

export { html, mini, eventHandler, State };

/**
 * @template S
 * @template V
 */
export class Mini {
  /**
    * @param {S} init
    * @param {(state: S) => V} view
    * @param {HTMLElement|null} node
    * @param {(node: HTMLElement, vdom: V) => void} patch
    * @param {(original: S, f: (a: S) => void)=>S} sharedUpdate
    */
  constructor(init, view, node, patch, sharedUpdate) {
    if (!node) {
      throw new Error("No root element");
    }
    this.state = init;
    this.view = view;
    this.node = node;
    this.sharedUpdate = sharedUpdate;
    this.patch = patch;
    this.busy = false;
    this.update();
  }
  /** @param {S} newState */
  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.update();
    }
  }
  update() {
    if (!this.busy) {
      this.busy = true;
      requestAnimationFrame((time) => {
        this.render(time);
        this.busy = false;
      });
    }
  }
  getState() {
    return this.state;
  }
  /** @param {(state: S) => void} f */
  dispatch(f) {
    this.setState(this.sharedUpdate(this.state, f));
  }
  /** @param {(event: Event, state: S) => void} f */
  eventHandler(f) {
    return (/** @type {Event} */ event) => {
      this.dispatch((state) => {
        f(event, state);
      });
    };
  }
  /** @param {number} time */
  render(time) {
    this.patch(this.node, this.view(this.state));
  }
}

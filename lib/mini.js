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
  /** @param {number} time */
  render(time) {
    this.patch(this.node, this.view(this.state));
  }

  /**
   * @template S
   * @template V
   * @param {(node: HTMLElement, vdom: V) => void} patch
   * @param {(original: S, f: (a: S) => void) => S} sharedUpdate
   * @return {(init: S, view: (state: S) => V, node: HTMLElement | null) => Mini<S, V>}
   */
  static app(patch, sharedUpdate) {
    return (init, view, node) =>
      new Mini(init, view, node, patch, sharedUpdate);
  }
}

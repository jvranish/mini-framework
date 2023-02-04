export class State {
  constructor() {
    /** @type {string[]} */
    this.todos = [];
    this.todoInput = "";
  }

  addTodo(todo = this.todoInput) {
    if (todo === "") return;
    this.todos.unshift(this.todoInput);
    this.todoInput = "";
  }

  /** @param {string} value */
  updateTodoInput(value) {
    this.todoInput = value;
  }
}

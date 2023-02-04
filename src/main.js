import { html, eventHandler, State } from "./app.js";

const updateValue = eventHandler((event, state) => {
  if (event.target instanceof HTMLInputElement) {
    state.updateTodoInput(event.target.value);
  }
});

const addTodo = eventHandler((_event, state) => {
  state.addTodo();
});

/**
 * @param {State} state
 * @return {ReturnType<typeof html>}
 */
export const main = (state) =>
  html`
    <main>
      <h2>To-do list</h2>
      <section>
        <input type="text" value=${state.todoInput} oninput=${updateValue} />
        <button disabled=${!state.todoInput} onclick=${addTodo}>
          Add todo
        </button>
      </section>
      <ul>
        ${state.todos.map(
          (todo) => html`
            <li>
              <label>
                <input type="checkbox" />
                <span>${todo}</span>
              </label>
            </li>
          `
        )}
      </ul>
    </main>
  `;

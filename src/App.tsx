import { useRef } from "react";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { useTodos } from "./hooks/useTodos";
import "./App.css";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    remainingCount,
    storageError,
  } = useTodos();

  const summary =
    remainingCount === 0
      ? "Все задачи выполнены."
      : `Осталось выполнить: ${remainingCount}`;

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <header className="todo-header">
          <p className="eyebrow">Ваш день под контролем</p>
          <h1 id="page-title">Список задач</h1>
          <p className="subtitle">
            Запишите важное, чтобы освободить мысли для действительно нужного.
          </p>
        </header>

        {storageError && (
          <p className="storage-warning" role="status">
            Не удалось сохранить изменения в браузере. В этой сессии список
            продолжит работать, но после закрытия страницы задачи могут
            исчезнуть.
          </p>
        )}

        <TodoForm inputRef={inputRef} onAdd={addTodo} />
        <div className="todo-summary" aria-live="polite">
          {summary}
        </div>
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </section>
    </main>
  );
}

export default App;

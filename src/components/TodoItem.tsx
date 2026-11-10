import type { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        className="todo-checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Отметить задачу «${todo.text}» как ${todo.completed ? "невыполненную" : "выполненную"}`}
      />
      <span className="todo-text">{todo.text}</span>
      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Удалить задачу «${todo.text}»`}
        title="Удалить задачу"
      >
        ×
      </button>
    </li>
  );
}

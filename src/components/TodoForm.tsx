import { type FormEvent, type RefObject, useState } from "react";
import { MAX_TODO_LENGTH } from "../hooks/useTodos";

interface TodoFormProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onAdd: (text: string) => void;
}

export function TodoForm({ inputRef, onAdd }: TodoFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();

    if (!text) {
      setError("Введите текст задачи.");
      return;
    }

    if (text.length > MAX_TODO_LENGTH) {
      setError(`Задача не может быть длиннее ${MAX_TODO_LENGTH} символов.`);
      return;
    }

    onAdd(text);
    setValue("");
    setError("");
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="todo-form">
        <input
          ref={inputRef}
          className="todo-input"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError("");
          }}
          aria-label="Новая задача"
          aria-describedby={error ? "todo-form-error" : undefined}
          placeholder="Что нужно сделать?"
        />
        <button className="add-button" type="submit">
          Добавить
        </button>
      </div>
      {error && (
        <p id="todo-form-error" className="todo-form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

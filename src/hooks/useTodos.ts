import { useState } from "react";
import type { Todo } from "../types/todo";
import { loadTodos, saveTodos } from "../utils/storage";

export const MAX_TODO_LENGTH = 500;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [storageError, setStorageError] = useState(false);

  function updateTodos(nextTodos: Todo[]) {
    if (!saveTodos(nextTodos)) setStorageError(true);
    setTodos(nextTodos);
  }

  function addTodo(text: string) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    updateTodos([newTodo, ...todos]);
  }

  function toggleTodo(id: string) {
    updateTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    updateTodos(todos.filter((todo) => todo.id !== id));
  }

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    remainingCount: todos.filter((todo) => !todo.completed).length,
    storageError,
  };
}

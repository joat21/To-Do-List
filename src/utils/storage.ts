import type { Todo } from "../types/todo";

export const STORAGE_KEY = "todo-list-items";

function isTodo(value: unknown): value is Todo {
  if (!value || typeof value !== "object") return false;

  const todo = value as Record<string, unknown>;

  return (
    typeof todo.id === "string" &&
    typeof todo.text === "string" &&
    typeof todo.completed === "boolean" &&
    typeof todo.createdAt === "number"
  );
}

export function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return true;
  } catch {
    return false;
  }
}

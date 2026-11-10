import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Todo } from "../types/todo";
import { loadTodos, saveTodos, STORAGE_KEY } from "./storage";

const validTodo: Todo = {
  id: "todo-1",
  text: "Проверить задачу",
  completed: false,
  createdAt: 1,
};

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("возвращает пустой список при отсутствии сохранённых данных", () => {
    expect(loadTodos()).toEqual([]);
  });

  it("загружает валидные задачи", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([validTodo]));

    expect(loadTodos()).toEqual([validTodo]);
  });

  it("игнорирует некорректные записи в массиве", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([validTodo, { id: 42 }, null]),
    );

    expect(loadTodos()).toEqual([validTodo]);
  });

  it("безопасно обрабатывает некорректный JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{");

    expect(loadTodos()).toEqual([]);
  });

  it("отклоняет сохранённые данные с неожиданной структурой", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos: [validTodo] }));

    expect(loadTodos()).toEqual([]);
  });

  it("сохраняет задачи", () => {
    expect(saveTodos([validTodo])).toBe(true);

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")).toEqual([
      validTodo,
    ]);
  });

  it("безопасно обрабатывает ошибку чтения из localStorage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Недоступно");
    });

    expect(loadTodos()).toEqual([]);
  });

  it("возвращает false при ошибке записи в localStorage", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Переполнено");
    });

    expect(saveTodos([validTodo])).toBe(false);
  });
});

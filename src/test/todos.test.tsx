import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { STORAGE_KEY } from "../utils/storage";

const initialTodos = [
  {
    id: "todo-1",
    text: "Прочитать статью",
    completed: false,
    createdAt: 1,
  },
];

describe("TodoList", () => {
  beforeEach(() => {
    localStorage.clear();

    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "00000000-0000-0000-0000-000000000001",
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("показывает пустое состояние при отсутствии задач", () => {
    render(<App />);

    expect(
      screen.getByText("Список пуст. Добавьте первую задачу."),
    ).toBeVisible();
  });

  it("переключает статус задачи и обновляет счётчик", async () => {
    const user = userEvent.setup();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTodos));

    render(<App />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
    expect(screen.getByText("Осталось выполнить: 1")).toBeVisible();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByText("Все задачи выполнены.")).toBeVisible();

    const savedAfterCompletion = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    );

    expect(savedAfterCompletion[0].completed).toBe(true);

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(screen.getByText("Осталось выполнить: 1")).toBeVisible();
  });

  it("удаляет только выбранную задачу", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "first",
          text: "Первая задача",
          completed: false,
          createdAt: 1,
        },
        {
          id: "second",
          text: "Вторая задача",
          completed: false,
          createdAt: 2,
        },
      ]),
    );

    render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: "Удалить задачу «Первая задача»",
      }),
    );

    expect(screen.queryByText("Первая задача")).not.toBeInTheDocument();
    expect(screen.getByText("Вторая задача")).toBeVisible();

    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

    expect(savedTodos).toHaveLength(1);
    expect(savedTodos[0].id).toBe("second");
  });
});

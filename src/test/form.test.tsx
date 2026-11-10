import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { STORAGE_KEY } from "../utils/storage";

describe("TodoForm", () => {
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

  it("добавляет задачу кнопкой, удаляет лишние пробелы и очищает поле", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText("Новая задача");

    await user.type(input, "  Купить молоко  ");
    await user.click(screen.getByRole("button", { name: "Добавить" }));

    expect(screen.getByText("Купить молоко")).toBeVisible();
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();

    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

    expect(savedTodos).toEqual([
      expect.objectContaining({
        text: "Купить молоко",
        completed: false,
      }),
    ]);
  });

  it("добавляет задачу нажатием Enter", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText("Новая задача");

    await user.type(input, "Позвонить{Enter}");

    expect(screen.getByText("Позвонить")).toBeVisible();
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("отклоняет пустую задачу и строку из пробелов", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText("Новая задача");
    const addButton = screen.getByRole("button", { name: "Добавить" });

    await user.click(addButton);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Введите текст задачи.",
    );

    await user.type(input, "   ");
    await user.keyboard("{Enter}");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Введите текст задачи.",
    );

    expect(
      screen.getByText("Список пуст. Добавьте первую задачу."),
    ).toBeVisible();
  });

  it("принимает 500 символов и отклоняет 501 символ", () => {
    render(<App />);

    const input = screen.getByLabelText("Новая задача");
    const form = input.closest("form");

    expect(form).not.toBeNull();

    const validText = "а".repeat(500);
    const invalidText = "б".repeat(501);

    // Программно устанавливаем значение, чтобы проверить именно
    // JavaScript-валидацию, а не ограничение браузера через maxLength.
    fireEvent.change(input, {
      target: { value: validText },
    });

    fireEvent.submit(form!);

    expect(screen.getByText(validText)).toBeVisible();

    fireEvent.change(input, {
      target: { value: invalidText },
    });

    fireEvent.submit(form!);

    expect(screen.getByRole("alert")).toHaveTextContent("500 символов");
    expect(screen.queryByText(invalidText)).not.toBeInTheDocument();
  });
});

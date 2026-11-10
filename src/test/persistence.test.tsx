import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY } from "../utils/storage";
import App from "../App";

describe("Todo persistence", () => {
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

  it("восстанавливает задачи из localStorage при запуске", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "saved",
          text: "Сохранённая задача",
          completed: true,
          createdAt: 1,
        },
      ]),
    );

    render(<App />);

    expect(screen.getByText("Сохранённая задача")).toBeVisible();
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("продолжает работать в текущей сессии при ошибке сохранения", async () => {
    const user = userEvent.setup();

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Переполнено");
    });

    render(<App />);

    const input = screen.getByLabelText("Новая задача");

    await user.type(input, "Временная задача");
    await user.keyboard("{Enter}");

    expect(screen.getByText("Временная задача")).toBeVisible();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Не удалось сохранить изменения в браузере",
    );

    // Даже после ошибки сохранения можно менять состояние задачи.
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(checkbox).toBeChecked();

    // Удаление также должно работать независимо от localStorage.
    await user.click(
      screen.getByRole("button", {
        name: "Удалить задачу «Временная задача»",
      }),
    );

    expect(screen.queryByText("Временная задача")).not.toBeInTheDocument();
  });
});

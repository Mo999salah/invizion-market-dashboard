/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_CREDENTIALS } from "@/features/auth/config/demoCredentials";

import { LoginForm } from "./LoginForm";

const { login, replaceRoute } = vi.hoisted(() => ({
  login: vi.fn(),
  replaceRoute: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceRoute }),
}));

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({ login }),
}));

beforeEach(() => {
  login.mockReset();
  login.mockReturnValue("success");
  replaceRoute.mockReset();
});

afterEach(cleanup);

describe("LoginForm", () => {
  it("uses the demo credentials and opens the dashboard", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(
      screen.getByRole("button", { name: "Fill demo credentials" }),
    );
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(login).toHaveBeenCalledWith(DEMO_CREDENTIALS);
    expect(replaceRoute).toHaveBeenCalledWith("/dashboard");
  });

  it("explains when the browser cannot persist the session", async () => {
    login.mockReturnValue("storage-unavailable");
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(
      screen.getByRole("button", { name: "Fill demo credentials" }),
    );
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      screen.getByText(
        "This browser could not save the demo session. Enable local storage and try again.",
      ),
    ).toBeTruthy();
    expect(replaceRoute).not.toHaveBeenCalled();
  });
});

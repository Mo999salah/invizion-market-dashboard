/** @vitest-environment jsdom */

import { useState } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_CREDENTIALS } from "@/features/auth/config/demoCredentials";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { LoginResult } from "@/features/auth/types/auth";

import { AuthProvider } from "./AuthProvider";

const SESSION_STORAGE_KEY = "invizion.demo-session.v1";

function AuthHarness() {
  const { isAuthenticated, isInitialized, login, logout } = useAuth();
  const [lastLoginResult, setLastLoginResult] = useState<LoginResult | null>(null);

  return (
    <div>
      <p>{isInitialized ? "initialized" : "initializing"}</p>
      <p>{isAuthenticated ? "signed in" : "signed out"}</p>
      <p>{lastLoginResult === null ? "not attempted" : String(lastLoginResult)}</p>
      <button
        type="button"
        onClick={() => setLastLoginResult(login(DEMO_CREDENTIALS))}
      >
        Sign in
      </button>
      <button type="button" onClick={logout}>
        Sign out
      </button>
    </div>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("AuthProvider", () => {
  it("persists a successful login and clears it on logout", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    expect(screen.getByText("initialized")).toBeTruthy();
    expect(screen.getByText("signed out")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(screen.getByText("signed in")).toBeTruthy());
    expect(screen.getByText("success")).toBeTruthy();
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBe(
      JSON.stringify({ email: DEMO_CREDENTIALS.email }),
    );

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => expect(screen.getByText("signed out")).toBeTruthy());
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it("does not authenticate when the browser cannot persist the session", async () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("Storage is unavailable");
    });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByText("storage-unavailable")).toBeTruthy();
    expect(screen.getByText("signed out")).toBeTruthy();
  });

  it("clears a malformed stored session after render", async () => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, "not-json");

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    expect(screen.getByText("signed out")).toBeTruthy();
    await waitFor(() =>
      expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull(),
    );
  });
});

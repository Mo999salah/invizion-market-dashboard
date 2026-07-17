/** @vitest-environment jsdom */

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/features/auth/providers/AuthProvider";

import { ProtectedRoute } from "./ProtectedRoute";

const SESSION_STORAGE_KEY = "invizion.demo-session.v1";
const { replaceRoute } = vi.hoisted(() => ({ replaceRoute: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceRoute }),
}));

beforeEach(() => {
  replaceRoute.mockReset();
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("ProtectedRoute", () => {
  it("redirects an unauthenticated visitor to the login page", async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <p>Private market content</p>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => expect(replaceRoute).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("Private market content")).toBeNull();
  });

  it("renders protected content for a persisted demo session", () => {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ email: "demo@invizion.com" }),
    );

    render(
      <AuthProvider>
        <ProtectedRoute>
          <p>Private market content</p>
        </ProtectedRoute>
      </AuthProvider>,
    );

    expect(screen.getByText("Private market content")).toBeTruthy();
    expect(replaceRoute).not.toHaveBeenCalled();
  });
});

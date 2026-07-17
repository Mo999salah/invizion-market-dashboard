/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearDemoSession,
  getDemoSessionSnapshot,
  parseDemoSessionSnapshot,
  persistDemoSession,
} from "./demoSessionStorage";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("demo session storage", () => {
  it("parses a valid demo session", () => {
    expect(
      parseDemoSessionSnapshot(JSON.stringify({ email: "demo@invizion.com" })),
    ).toEqual({ email: "demo@invizion.com" });
  });

  it("rejects invalid snapshots without mutating storage during parsing", () => {
    const removeItem = vi.spyOn(window.localStorage, "removeItem");

    expect(parseDemoSessionSnapshot("not-json")).toBeNull();
    expect(
      parseDemoSessionSnapshot(JSON.stringify({ email: "other@example.com" })),
    ).toBeNull();
    expect(removeItem).not.toHaveBeenCalled();
  });

  it("reports whether persistence succeeded", () => {
    expect(persistDemoSession({ email: "demo@invizion.com" })).toBe(true);
    expect(parseDemoSessionSnapshot(getDemoSessionSnapshot())).toEqual({
      email: "demo@invizion.com",
    });

    clearDemoSession();
    expect(getDemoSessionSnapshot()).toBeNull();
  });

  it("reports a storage write failure", () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("Storage is unavailable");
    });

    expect(persistDemoSession({ email: "demo@invizion.com" })).toBe(false);
  });
});

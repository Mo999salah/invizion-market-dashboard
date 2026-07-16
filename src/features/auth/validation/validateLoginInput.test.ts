import { describe, expect, it } from "vitest";

import { validateLoginInput } from "./validateLoginInput";

describe("validateLoginInput", () => {
  it("reports missing credentials", () => {
    expect(validateLoginInput({ email: "", password: "" })).toEqual({
      email: "Email is required.",
      password: "Password is required.",
    });
  });

  it("reports malformed input", () => {
    expect(
      validateLoginInput({ email: "demo", password: "123" }),
    ).toEqual({
      email: "Enter a valid email address.",
      password: "Password must contain at least 6 characters.",
    });
  });

  it("accepts the demo credentials", () => {
    expect(
      validateLoginInput({
        email: "demo@invizion.com",
        password: "demo123",
      }),
    ).toEqual({});
  });
});

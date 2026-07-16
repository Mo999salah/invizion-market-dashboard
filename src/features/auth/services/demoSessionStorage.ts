import { DEMO_CREDENTIALS } from "@/features/auth/config/demoCredentials";
import type { DemoSession } from "@/features/auth/types/auth";

const DEMO_SESSION_STORAGE_KEY = "invizion.demo-session.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDemoSession(value: unknown): value is DemoSession {
  return (
    isRecord(value) &&
    Object.keys(value).length === 1 &&
    value.email === DEMO_CREDENTIALS.email
  );
}

/**
 * Demo-only client-side session persistence. This localStorage value can be
 * viewed, changed, or forged by anyone and must not be treated as production
 * authentication or authorization.
 */
export function readDemoSession(): DemoSession | null {
  try {
    const storedValue = window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);

    if (storedValue === null) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isDemoSession(parsedValue)) {
      clearDemoSession();
      return null;
    }

    return { email: parsedValue.email };
  } catch {
    clearDemoSession();
    return null;
  }
}

export function persistDemoSession(session: DemoSession): void {
  try {
    window.localStorage.setItem(
      DEMO_SESSION_STORAGE_KEY,
      JSON.stringify({ email: session.email }),
    );
  } catch {
    // The in-memory demo session remains usable if storage is unavailable.
  }
}

export function clearDemoSession(): void {
  try {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
  } catch {
    // There is no persistent session to clear when storage is unavailable.
  }
}

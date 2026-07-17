import { DEMO_CREDENTIALS } from "@/features/auth/config/demoCredentials";
import type { DemoSession } from "@/features/auth/types/auth";

const DEMO_SESSION_STORAGE_KEY = "invizion.demo-session.v1";
const DEMO_SESSION_CHANGE_EVENT = "invizion:demo-session-change";

export type DemoSessionSnapshot = string | null | undefined;

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
export function parseDemoSessionSnapshot(
  storedValue: DemoSessionSnapshot,
): DemoSession | null {
  if (storedValue === null || storedValue === undefined) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isDemoSession(parsedValue)) {
      return null;
    }

    return { email: parsedValue.email };
  } catch {
    return null;
  }
}

export function getDemoSessionSnapshot(): DemoSessionSnapshot {
  try {
    return window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getServerDemoSessionSnapshot(): DemoSessionSnapshot {
  return undefined;
}

export function subscribeToDemoSession(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  window.addEventListener(DEMO_SESSION_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(DEMO_SESSION_CHANGE_EVENT, listener);
  };
}

function notifyDemoSessionChange(): void {
  window.dispatchEvent(new Event(DEMO_SESSION_CHANGE_EVENT));
}

export function persistDemoSession(session: DemoSession): boolean {
  try {
    window.localStorage.setItem(
      DEMO_SESSION_STORAGE_KEY,
      JSON.stringify({ email: session.email }),
    );
    notifyDemoSessionChange();
    return true;
  } catch {
    return false;
  }
}

export function clearDemoSession(): void {
  try {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    notifyDemoSessionChange();
  } catch {
    return;
  }
}

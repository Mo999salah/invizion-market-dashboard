import { DEMO_CREDENTIALS } from "@/features/auth/config/demoCredentials";
import {
  clearDemoSession,
  persistDemoSession,
  readDemoSession,
} from "@/features/auth/services/demoSessionStorage";
import type {
  AuthSnapshot,
  DemoCredentials,
  DemoSession,
} from "@/features/auth/types/auth";

type AuthStoreListener = () => void;

const UNINITIALIZED_AUTH_SNAPSHOT: AuthSnapshot = {
  session: null,
  isInitialized: false,
};

let authSnapshot = UNINITIALIZED_AUTH_SNAPSHOT;
const listeners = new Set<AuthStoreListener>();

function publishSnapshot(nextSnapshot: AuthSnapshot): void {
  authSnapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

export function subscribeToAuthStore(listener: AuthStoreListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  return authSnapshot;
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return UNINITIALIZED_AUTH_SNAPSHOT;
}

export function initializeAuthStore(): void {
  if (authSnapshot.isInitialized) {
    return;
  }

  publishSnapshot({
    session: readDemoSession(),
    isInitialized: true,
  });
}

export function authenticateDemoCredentials(
  credentials: DemoCredentials,
): boolean {
  const emailMatches =
    credentials.email.trim().toLocaleLowerCase("en-US") ===
    DEMO_CREDENTIALS.email;
  const passwordMatches = credentials.password === DEMO_CREDENTIALS.password;

  if (!emailMatches || !passwordMatches) {
    return false;
  }

  const session: DemoSession = {
    email: DEMO_CREDENTIALS.email,
  };

  persistDemoSession(session);
  publishSnapshot({ session, isInitialized: true });

  return true;
}

export function endDemoSession(): void {
  clearDemoSession();
  publishSnapshot({ session: null, isInitialized: true });
}

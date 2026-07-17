"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { DEMO_CREDENTIALS } from "@/features/auth/config/demoCredentials";
import { AuthContext } from "@/features/auth/context/authContext";
import {
  clearDemoSession,
  getDemoSessionSnapshot,
  getServerDemoSessionSnapshot,
  parseDemoSessionSnapshot,
  persistDemoSession,
  subscribeToDemoSession,
} from "@/features/auth/services/demoSessionStorage";
import type {
  DemoCredentials,
  LoginResult,
} from "@/features/auth/types/auth";

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const sessionSnapshot = useSyncExternalStore(
    subscribeToDemoSession,
    getDemoSessionSnapshot,
    getServerDemoSessionSnapshot,
  );
  const session = parseDemoSessionSnapshot(sessionSnapshot);
  const isInitialized = sessionSnapshot !== undefined;
  const hasInvalidStoredSession =
    sessionSnapshot !== undefined &&
    sessionSnapshot !== null &&
    session === null;

  useEffect(() => {
    if (hasInvalidStoredSession) {
      clearDemoSession();
    }
  }, [hasInvalidStoredSession]);

  function login(credentials: DemoCredentials): LoginResult {
    const emailMatches =
      credentials.email.trim().toLocaleLowerCase("en-US") ===
      DEMO_CREDENTIALS.email;
    const passwordMatches = credentials.password === DEMO_CREDENTIALS.password;

    if (!emailMatches || !passwordMatches) {
      return "invalid-credentials";
    }

    const nextSession = { email: DEMO_CREDENTIALS.email };
    return persistDemoSession(nextSession) ? "success" : "storage-unavailable";
  }

  function logout() {
    clearDemoSession();
  }

  const contextValue = {
    isAuthenticated: session !== null,
    isInitialized,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

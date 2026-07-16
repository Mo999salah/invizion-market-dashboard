"use client";

import { useSyncExternalStore } from "react";
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
import type { DemoCredentials } from "@/features/auth/types/auth";

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

  function login(credentials: DemoCredentials): boolean {
    const emailMatches =
      credentials.email.trim().toLocaleLowerCase("en-US") ===
      DEMO_CREDENTIALS.email;
    const passwordMatches = credentials.password === DEMO_CREDENTIALS.password;

    if (!emailMatches || !passwordMatches) {
      return false;
    }

    const nextSession = { email: DEMO_CREDENTIALS.email };
    persistDemoSession(nextSession);

    return true;
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

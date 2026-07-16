"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

import { AuthContext } from "@/features/auth/context/authContext";
import {
  authenticateDemoCredentials,
  endDemoSession,
  getAuthSnapshot,
  getServerAuthSnapshot,
  initializeAuthStore,
  subscribeToAuthStore,
} from "@/features/auth/stores/authStore";
import type {
  AuthContextValue,
  DemoCredentials,
} from "@/features/auth/types/auth";

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const snapshot = useSyncExternalStore(
    subscribeToAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  useEffect(() => {
    initializeAuthStore();
  }, []);

  const login = useCallback((credentials: DemoCredentials) => {
    return Promise.resolve(authenticateDemoCredentials(credentials));
  }, []);

  const logout = useCallback(() => {
    endDemoSession();
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      ...snapshot,
      isAuthenticated: snapshot.session !== null,
      login,
      logout,
    }),
    [login, logout, snapshot],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

"use client";

import { useContext } from "react";

import { AuthContext } from "@/features/auth/context/authContext";
import type { AuthContextValue } from "@/features/auth/types/auth";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

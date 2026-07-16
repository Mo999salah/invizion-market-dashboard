"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function HomeRedirect() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized) {
      router.replace(isAuthenticated ? "/dashboard" : "/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <AuthLoadingScreen
      message={
        isInitialized
          ? "Opening Invizion…"
          : "Checking your demo session…"
      }
    />
  );
}

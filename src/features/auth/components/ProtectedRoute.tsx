"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useAuth } from "@/features/auth/hooks/useAuth";

type ProtectedRouteProps = Readonly<{
  children: ReactNode;
}>;

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthLoadingScreen message="Redirecting to demo login…" />;
  }

  return children;
}

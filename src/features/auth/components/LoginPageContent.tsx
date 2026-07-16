"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function LoginPageContent() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <AuthLoadingScreen message="Opening the dashboard…" />;
  }

  return <LoginForm />;
}

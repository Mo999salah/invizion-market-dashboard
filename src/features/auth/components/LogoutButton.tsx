"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Log out of the demo session"
      className="h-9 shrink-0 rounded-md border border-line bg-transparent px-3.5 text-sm text-muted transition-colors hover:border-faint hover:text-fg"
    >
      Log out
    </button>
  );
}

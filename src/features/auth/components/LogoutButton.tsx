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
      className="h-10 shrink-0 rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
    >
      Log out
    </button>
  );
}

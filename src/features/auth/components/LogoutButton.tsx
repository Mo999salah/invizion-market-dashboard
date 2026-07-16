"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/ui/Button";
import { Icon } from "@/shared/components/ui/Icon";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <Button
      type="button"
      onClick={handleLogout}
      aria-label="Log out of the demo session"
      variant="ghost"
      leadingIcon={<Icon name="logout" size={16} />}
    >
      Log out
    </Button>
  );
}

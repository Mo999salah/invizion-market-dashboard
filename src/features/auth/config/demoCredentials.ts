import type { DemoCredentials } from "@/features/auth/types/auth";

export const DEMO_CREDENTIALS = {
  email: "demo@invizion.com",
  password: "demo123",
} as const satisfies DemoCredentials;

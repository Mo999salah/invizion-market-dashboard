import type { DemoCredentials } from "@/features/auth/types/auth";

export type LoginFieldErrors = Readonly<{
  email?: string;
  password?: string;
}>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginInput(
  credentials: DemoCredentials,
): LoginFieldErrors {
  const errors: {
    email?: string;
    password?: string;
  } = {};
  const normalizedEmail = credentials.email.trim();

  if (normalizedEmail.length === 0) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (credentials.password.length === 0) {
    errors.password = "Password is required.";
  } else if (credentials.password.length < 6) {
    errors.password = "Password must contain at least 6 characters.";
  }

  return errors;
}

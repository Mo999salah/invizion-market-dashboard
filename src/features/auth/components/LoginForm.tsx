"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { DEMO_CREDENTIALS } from "@/features/auth/config/demoCredentials";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  validateLoginInput,
  type LoginFieldErrors,
} from "@/features/auth/validation/validateLoginInput";
import { AppTopBar } from "@/shared/components/ui/AppTopBar";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [credentialError, setCredentialError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const credentialErrorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (credentialError) {
      credentialErrorRef.current?.focus();
    }
  }, [credentialError]);

  function handleEmailChange(value: string) {
    setEmail(value);
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      email: undefined,
    }));
    setCredentialError(null);
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
    }));
    setCredentialError(null);
  }

  function handleUseDemoAccount() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setFieldErrors({});
    setCredentialError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const credentials = { email, password };
    const validationErrors = validateLoginInput(credentials);

    setFieldErrors(validationErrors);
    setCredentialError(null);

    if (validationErrors.email || validationErrors.password) {
      if (validationErrors.email) {
        emailInputRef.current?.focus();
      } else {
        passwordInputRef.current?.focus();
      }

      return;
    }

    setIsSubmitting(true);
    const isValidLogin = await login(credentials);

    if (!isValidLogin) {
      setCredentialError(
        "The email or password does not match the demo credentials.",
      );
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col bg-ink font-sans text-fg">
      <AppTopBar />

      {/* ── Centered hero login block ── */}
      <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <section
          aria-labelledby="login-title"
          className="w-full max-w-md"
        >
          {/* Brand + heading */}
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
            Invizion
          </p>
          <h1
            id="login-title"
            className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-[2rem]"
          >
            Sign in to the Desk
          </h1>
          <p
            id="demo-auth-description"
            className="mt-3 text-[0.9375rem] leading-relaxed text-muted"
          >
            This assessment uses client-side demo authentication only.
            It is not production security.
          </p>

          {/* ── Form ── */}
          <form
            className="mt-10 grid gap-6"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="demo-auth-description"
            aria-busy={isSubmitting}
          >
            <div>
              <label
                className="block text-[0.9375rem] font-medium text-fg"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                ref={emailInputRef}
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className="mt-2 h-12 w-full rounded-md border border-line bg-panel px-4 text-[0.9375rem] text-fg outline-none placeholder:text-faint focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="you@example.com"
              />
              {fieldErrors.email ? (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-loss"
                  role="alert"
                >
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label
                className="block text-[0.9375rem] font-medium text-fg"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                ref={passwordInputRef}
                name="password"
                type="password"
                required
                value={password}
                onChange={(event) => handlePasswordChange(event.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-invalid={fieldErrors.password ? true : undefined}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                className="mt-2 h-12 w-full rounded-md border border-line bg-panel px-4 text-[0.9375rem] text-fg outline-none placeholder:text-faint focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Enter the demo password"
              />
              {fieldErrors.password ? (
                <p
                  id="password-error"
                  className="mt-2 text-sm text-loss"
                  role="alert"
                >
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            {credentialError ? (
              <p
                id="credential-error"
                ref={credentialErrorRef}
                tabIndex={-1}
                className="rounded-md border-l-2 border-loss bg-loss/10 px-4 py-3 text-sm text-loss"
                role="alert"
              >
                {credentialError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-md bg-fg px-6 text-[0.9375rem] font-semibold text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* ── Demo credentials footnote ── */}
          <div className="mt-8 rounded-md border border-line/60 bg-panel/50 px-4 py-3 text-sm">
            <dl>
              <div className="flex items-baseline justify-between gap-4 py-1">
                <dt className="shrink-0 text-faint">Demo email</dt>
                <dd className="break-all text-right font-mono text-[0.8125rem] text-muted">
                  {DEMO_CREDENTIALS.email}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-1">
                <dt className="shrink-0 text-faint">Demo password</dt>
                <dd className="text-right font-mono text-[0.8125rem] text-muted">
                  {DEMO_CREDENTIALS.password}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleUseDemoAccount}
              disabled={isSubmitting}
              className="mt-3 h-10 w-full rounded-md border border-accent/30 bg-accent/5 px-4 text-sm font-medium text-accent transition-colors duration-300 ease-out hover:border-accent/50 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Use demo account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

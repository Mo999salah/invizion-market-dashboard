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
    <main className="grid min-h-screen place-items-center bg-zinc-950 p-4 font-sans text-zinc-100 sm:p-6">
      <section
        aria-labelledby="login-title"
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-black/20 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Demo authentication
        </p>
        <h1 id="login-title" className="mt-2 text-2xl font-semibold">
          Sign in to Invizion
        </h1>
        <p
          id="demo-auth-description"
          className="mt-2 text-sm leading-6 text-zinc-300"
        >
          This assessment uses client-side demo authentication only. It is not
          production security.
        </p>

        <div className="mt-5 rounded-lg border border-cyan-900 bg-cyan-950/40 p-4 text-sm">
          <p className="font-medium text-cyan-200">Demo credentials</p>
          <dl className="mt-3 grid gap-2 text-zinc-300">
            <div className="grid gap-1 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4">
              <dt>Email</dt>
              <dd className="break-all font-mono text-xs sm:text-right">
                {DEMO_CREDENTIALS.email}
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4">
              <dt>Password</dt>
              <dd className="font-mono text-xs sm:text-right">
                {DEMO_CREDENTIALS.password}
              </dd>
            </div>
          </dl>
        </div>

        <form
          className="mt-6 grid gap-5"
          onSubmit={handleSubmit}
          noValidate
          aria-describedby="demo-auth-description"
          aria-busy={isSubmitting}
        >
          <div>
            <label className="text-sm font-medium text-zinc-200" htmlFor="email">
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
              className="mt-2 h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="you@example.com"
            />
            {fieldErrors.email ? (
              <p
                id="email-error"
                className="mt-2 text-sm text-rose-300"
                role="alert"
              >
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label
              className="text-sm font-medium text-zinc-200"
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
              className="mt-2 h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Enter the demo password"
            />
            {fieldErrors.password ? (
              <p
                id="password-error"
                className="mt-2 text-sm text-rose-300"
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
              className="rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-300"
              role="alert"
            >
              {credentialError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-md bg-cyan-500 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in to demo"}
          </button>
        </form>
      </section>
    </main>
  );
}

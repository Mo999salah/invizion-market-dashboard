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
import { Button } from "@/shared/components/ui/Button";
import { Icon } from "@/shared/components/ui/Icon";
import { TextField } from "@/shared/components/ui/TextField";

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    const loginResult = login(credentials);

    if (loginResult !== "success") {
      setCredentialError(
        loginResult === "storage-unavailable"
          ? "This browser could not save the demo session. Enable local storage and try again."
          : "The email or password does not match the demo credentials.",
      );
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <main className="trading-shell flex min-h-dvh flex-col font-sans text-fg">
      <AppTopBar />

      <div className="mx-auto grid w-full max-w-[88rem] flex-1 items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(23rem,0.55fr)] lg:gap-24 lg:py-16">
        <div className="max-w-3xl lg:self-center">
          <p className="mb-5 text-sm text-signal">Realtime digital asset intelligence</p>
          <h1
            id="login-title"
            className="display-type text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.83] tracking-[-0.075em] text-fg"
          >
            MARKET
            <br />
            <span className="text-secondary">INTELLIGENCE</span>
          </h1>
          <p
            id="demo-auth-description"
            className="mt-8 max-w-[58ch] text-base leading-7 text-muted-ui"
          >
            A focused operations desk for reviewing leading assets, monitoring
            price movement, and inspecting the market without noise.
          </p>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 border-y border-line text-sm">
            <div className="py-4 pr-3">
              <dt className="text-xs text-faint">Coverage</dt>
              <dd className="mt-1 font-mono text-secondary">20 assets</dd>
            </div>
            <div className="border-l border-line py-4 pl-4 pr-3">
              <dt className="text-xs text-faint">Refresh window</dt>
              <dd className="mt-1 font-mono text-secondary">60 sec</dd>
            </div>
            <div className="border-l border-line py-4 pl-4">
              <dt className="text-xs text-faint">Quote</dt>
              <dd className="mt-1 font-mono text-secondary">USD</dd>
            </div>
          </dl>
        </div>

        <section
          aria-labelledby="login-title"
          className="terminal-frame w-full border border-line bg-surface p-5 sm:p-8"
        >
          <p className="text-xs text-signal">Authorized access</p>
          <h2 className="display-type mt-2 text-2xl tracking-[-0.04em] text-fg">
            Open the market desk
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-ui">
            This assessment uses a browser-only demo session.
          </p>

          <form
            className="mt-7 grid gap-4"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="demo-auth-description"
            aria-busy={isSubmitting}
          >
            <TextField
              id="email"
              ref={emailInputRef}
              name="email"
              type="email"
              label="Email address"
              required
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              error={fieldErrors.email}
              leadingIcon={<Icon name="mail" size={17} />}
              placeholder="you@example.com"
            />

            <TextField
              id="password"
              ref={passwordInputRef}
              name="password"
              type="password"
              label="Password"
              required
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
              error={fieldErrors.password}
              leadingIcon={<Icon name="lock" size={17} />}
              placeholder="Demo password"
            />

            {credentialError ? (
              <p
                id="credential-error"
                ref={credentialErrorRef}
                tabIndex={-1}
                className="flex items-start gap-2 border border-loss bg-canvas px-3 py-3 text-sm leading-5 text-loss"
                role="alert"
              >
                <Icon name="alert" size={17} className="mt-0.5 shrink-0" />
                <span>{credentialError}</span>
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-7 border-t border-line pt-5">
            <dl className="mb-4 grid gap-1 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-faint">Demo email</dt>
                <dd className="font-mono text-secondary">{DEMO_CREDENTIALS.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-faint">Password</dt>
                <dd className="font-mono text-secondary">{DEMO_CREDENTIALS.password}</dd>
              </div>
            </dl>
            <Button
              type="button"
              onClick={handleUseDemoAccount}
              disabled={isSubmitting}
              className="w-full"
            >
              Fill demo credentials
            </Button>
          </div>

          <p className="mt-5 text-xs leading-5 text-faint">
            Demo authentication is local to this browser and is not production security.
          </p>
        </section>
      </div>
    </main>
  );
}

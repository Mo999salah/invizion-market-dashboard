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
    const isValidLogin = login(credentials);

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
    <main className="flex min-h-dvh flex-col bg-canvas font-sans text-fg">
      <AppTopBar />

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(22rem,0.65fr)] lg:gap-20 lg:py-16">
        <div className="max-w-xl lg:self-start lg:pt-10">
          <h1
            id="login-title"
            className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-fg sm:text-5xl"
          >
            Sign in to the Desk
          </h1>
          <p
            id="demo-auth-description"
            className="mt-5 max-w-[54ch] text-base leading-7 text-muted-ui"
          >
            Review the top market assets, search symbols, and inspect live price
            details from one focused workspace.
          </p>
          <p className="mt-8 flex items-start gap-3 text-sm leading-6 text-secondary">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-signal" />
            <span>
              Demo authentication runs only in this browser. It is not production
              security.
            </span>
          </p>
        </div>

        <section
          aria-labelledby="login-title"
          className="w-full border border-line bg-surface p-5 sm:p-7"
        >
          <h2 className="text-lg font-bold tracking-[-0.02em] text-fg">
            Demo access
          </h2>
          <p className="mt-1 text-sm text-muted-ui">
            Enter the demo credentials or fill them automatically.
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
            <Button
              type="button"
              onClick={handleUseDemoAccount}
              disabled={isSubmitting}
              className="w-full"
            >
              Use demo account
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

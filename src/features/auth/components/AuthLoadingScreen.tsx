import { AppTopBar } from "@/shared/components/ui/AppTopBar";

type AuthLoadingScreenProps = Readonly<{
  message?: string;
}>;

export function AuthLoadingScreen({
  message = "Checking your demo session…",
}: AuthLoadingScreenProps) {
  return (
    <main className="flex min-h-screen flex-col bg-ink font-sans text-fg">
      <AppTopBar />
      <h1 className="sr-only">Invizion Market Dashboard</h1>
      <div
        className="flex flex-1 items-center justify-center p-8"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="size-2 animate-pulse rounded-full bg-accent"
          />
          <p className="text-[0.9375rem] text-muted">{message}</p>
        </div>
      </div>
    </main>
  );
}

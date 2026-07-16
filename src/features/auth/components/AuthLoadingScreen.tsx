import { AppTopBar } from "@/shared/components/ui/AppTopBar";
import { Spinner } from "@/shared/components/ui/Spinner";

type AuthLoadingScreenProps = Readonly<{
  message?: string;
}>;

export function AuthLoadingScreen({
  message = "Checking your demo session…",
}: AuthLoadingScreenProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-canvas font-sans text-fg">
      <AppTopBar />
      <h1 className="sr-only">Invizion Market Dashboard</h1>
      <div
        className="mx-auto flex w-full max-w-screen-xl flex-1 items-center px-5 py-12 sm:px-8"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="w-full max-w-lg border-y border-line py-8">
          <div className="flex items-center gap-4 text-signal">
            <Spinner />
            <p className="text-[0.9375rem] font-medium text-secondary">
              {message}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

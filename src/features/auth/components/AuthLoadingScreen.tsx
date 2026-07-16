type AuthLoadingScreenProps = Readonly<{
  message?: string;
}>;

export function AuthLoadingScreen({
  message = "Checking your demo session…",
}: AuthLoadingScreenProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 p-6 font-sans text-zinc-100">
      <h1 className="sr-only">Invizion Market Dashboard</h1>
      <div
        className="text-center"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          aria-hidden="true"
          className="mx-auto block size-7 animate-pulse rounded-full border-4 border-cyan-950 bg-cyan-400"
        />
        <p className="mt-4 text-sm font-medium text-zinc-300">{message}</p>
      </div>
    </main>
  );
}

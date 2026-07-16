type MarketErrorStateProps = Readonly<{
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}>;

type MarketEmptyStateProps = Readonly<{
  isRefreshing: boolean;
  onRefresh: () => void;
}>;

function StateContainer({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 p-6 text-zinc-100">
      <section className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 text-center shadow-2xl shadow-black/20">
        {children}
      </section>
    </main>
  );
}

export function MarketLoadingState() {
  return (
    <StateContainer>
      <div role="status" aria-live="polite" aria-atomic="true">
        <span
          aria-hidden="true"
          className="mx-auto block size-8 animate-pulse rounded-full bg-cyan-500"
        />
        <h1 className="mt-4 text-lg font-semibold">Loading market data</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Fetching the latest assets from CoinGecko.
        </p>
      </div>
    </StateContainer>
  );
}

export function MarketErrorState({
  message,
  isRetrying,
  onRetry,
}: MarketErrorStateProps) {
  return (
    <StateContainer>
      <div role="alert" aria-labelledby="market-error-title">
        <h1 className="text-lg font-semibold text-rose-300">
          <span id="market-error-title">Market data is unavailable</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-5 h-10 rounded-md bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRetrying ? "Retrying…" : "Retry"}
        </button>
      </div>
    </StateContainer>
  );
}

export function MarketEmptyState({
  isRefreshing,
  onRefresh,
}: MarketEmptyStateProps) {
  return (
    <StateContainer>
      <div>
        <div role="status" aria-live="polite" aria-atomic="true">
          <h1 className="text-lg font-semibold">No market assets available</h1>
          <p className="mt-2 text-sm text-zinc-300">
            CoinGecko returned an empty market response.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="mt-5 h-10 rounded-md border border-cyan-700 bg-cyan-950 px-4 text-sm font-semibold text-cyan-100 hover:bg-cyan-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRefreshing ? "Refreshing…" : "Refresh market"}
        </button>
      </div>
    </StateContainer>
  );
}

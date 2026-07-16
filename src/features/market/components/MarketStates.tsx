import { AppTopBar } from "@/shared/components/ui/AppTopBar";

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
    <main className="flex min-h-screen flex-col bg-ink font-sans text-fg">
      <AppTopBar />
      <div className="flex flex-1 items-center justify-center p-8">
        <section className="w-full max-w-md text-center">{children}</section>
      </div>
    </main>
  );
}

export function MarketLoadingState() {
  return (
    <StateContainer>
      <div role="status" aria-live="polite" aria-atomic="true">
        <span
          aria-hidden="true"
          className="mx-auto block size-2 animate-pulse rounded-full bg-accent"
        />
        <h1 className="mt-5 text-lg font-semibold tracking-tight">
          Loading market data
        </h1>
        <p className="mt-2 text-[0.9375rem] text-muted">
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
        <h1 className="text-lg font-semibold tracking-tight text-loss">
          <span id="market-error-title">Market data is unavailable</span>
        </h1>
        <p className="mt-2 text-[0.9375rem] text-muted">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-8 h-11 rounded-md bg-fg px-5 text-[0.9375rem] font-semibold text-ink transition-colors hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-50"
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
          <h1 className="text-lg font-semibold tracking-tight">
            No market assets available
          </h1>
          <p className="mt-2 text-[0.9375rem] text-muted">
            CoinGecko returned an empty market response.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="mt-8 h-11 rounded-md border border-control bg-panel px-5 text-[0.9375rem] font-medium text-fg transition-colors hover:border-faint disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRefreshing ? "Refreshing…" : "Refresh market"}
        </button>
      </div>
    </StateContainer>
  );
}

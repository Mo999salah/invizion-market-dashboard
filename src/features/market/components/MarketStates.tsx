import { AppTopBar } from "@/shared/components/ui/AppTopBar";
import { Button } from "@/shared/components/ui/Button";
import { Icon } from "@/shared/components/ui/Icon";

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
    <main className="trading-shell flex min-h-dvh flex-col font-sans text-fg lg:h-dvh lg:overflow-hidden">
      <AppTopBar />
      <div className="mx-auto flex w-full max-w-screen-xl flex-1 items-center px-5 py-12 sm:px-8">
        <section className="terminal-frame w-full max-w-lg border border-line bg-surface p-8">
          {children}
        </section>
      </div>
    </main>
  );
}

export function MarketLoadingState() {
  return (
    <main className="trading-shell flex min-h-dvh flex-col font-sans text-fg lg:h-dvh lg:overflow-hidden">
      <AppTopBar />
      <div
        className="mx-auto flex min-h-0 w-full max-w-screen-xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-7"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">Loading market data from CoinGecko.</span>
        <div className="terminal-frame flex min-h-0 flex-1 flex-col overflow-hidden border border-line bg-surface">
          <div className="flex flex-col gap-5 border-b border-line px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div aria-hidden="true" className="grid gap-2.5">
              <span className="ui-skeleton block h-6 w-48" />
              <span className="ui-skeleton block h-3 w-64 max-w-full" />
            </div>
            <div aria-hidden="true" className="flex gap-3">
              <span className="ui-skeleton block h-12 min-w-0 flex-1 lg:w-64" />
              <span className="ui-skeleton block h-11 w-24" />
            </div>
          </div>
          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.62fr)_minmax(18rem,1fr)]">
            <div className="divide-y divide-line-soft" aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <div key={index} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                  <span className="ui-skeleton size-8 shrink-0 rounded-full" />
                  <span className="ui-skeleton h-3.5 w-28" />
                  <span className="ui-skeleton ml-auto h-3.5 w-20" />
                </div>
              ))}
            </div>
            <div className="hidden border-l border-line bg-raised p-6 lg:block" aria-hidden="true">
              <span className="ui-skeleton block size-11 rounded-full" />
              <span className="ui-skeleton mt-5 block h-7 w-40" />
              <span className="ui-skeleton mt-3 block h-4 w-24" />
              <div className="mt-10 grid gap-4">
                <span className="ui-skeleton block h-3.5 w-full" />
                <span className="ui-skeleton block h-3.5 w-5/6" />
                <span className="ui-skeleton block h-3.5 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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
        <Icon name="alert" size={22} className="text-loss" />
        <h1 className="mt-5 text-xl font-bold tracking-[-0.025em] text-fg">
          <span id="market-error-title">Market data is unavailable</span>
        </h1>
        <p className="mt-2 max-w-[55ch] text-[0.9375rem] leading-6 text-muted-ui">
          {message}
        </p>
        <Button
          type="button"
          onClick={onRetry}
          isLoading={isRetrying}
          leadingIcon={<Icon name="refresh" size={16} />}
          variant="primary"
          className="mt-7"
        >
          {isRetrying ? "Retrying…" : "Retry"}
        </Button>
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
          <h1 className="text-xl font-bold tracking-[-0.025em]">
            No market assets available
          </h1>
          <p className="mt-2 text-[0.9375rem] leading-6 text-muted-ui">
            CoinGecko returned an empty market response.
          </p>
        </div>
        <Button
          type="button"
          onClick={onRefresh}
          isLoading={isRefreshing}
          leadingIcon={<Icon name="refresh" size={16} />}
          className="mt-7"
        >
          {isRefreshing ? "Refreshing…" : "Refresh market"}
        </Button>
      </div>
    </StateContainer>
  );
}

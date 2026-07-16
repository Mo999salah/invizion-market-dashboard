type MarketToolbarProps = Readonly<{
  searchQuery: string;
  visibleAssetCount: number;
  totalAssetCount: number;
  isRefreshing: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}>;

/**
 * Unified command bar: title + metadata on the left,
 * search + count + refresh on the right — all in one row.
 */
export function MarketToolbar({
  searchQuery,
  visibleAssetCount,
  totalAssetCount,
  isRefreshing,
  onSearchChange,
  onRefresh,
}: MarketToolbarProps) {
  return (
    <div
      aria-label="Market controls"
      className="border-b border-line px-5 py-4 sm:px-6"
    >
      {/* ── Row 1: Title left, Controls right ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Title + meta */}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Market Dashboard
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-muted">
            <span>Top 20 by market capitalization</span>
            <span aria-hidden="true" className="text-line">·</span>
            <span>USD</span>
            <span aria-hidden="true" className="text-line">·</span>
            <span className="font-mono text-xs text-faint">CoinGecko</span>
          </p>
        </div>

        {/* Right: Search + count + refresh */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <label className="relative w-full sm:w-64" htmlFor="market-search">
            <span className="sr-only">Search assets</span>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="7" r="4.5" />
                <path d="m10.5 10.5 3 3" />
              </svg>
            </span>
            <input
              id="market-search"
              type="search"
              aria-controls="market-assets-table"
              aria-describedby="market-search-summary"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name or symbol"
              autoComplete="off"
              className="h-10 w-full rounded-md border border-line bg-panel pl-9 pr-3 text-sm text-fg outline-none placeholder:text-faint focus:border-accent/70"
            />
          </label>

          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className="inline-flex items-center gap-2 text-xs text-accent"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {isRefreshing ? (
                <>
                  <span
                    aria-hidden="true"
                    className="size-1.5 animate-pulse rounded-full bg-accent"
                  />
                  Refreshing
                </>
              ) : null}
            </span>

            <p
              id="market-search-summary"
              className="whitespace-nowrap font-mono text-xs text-muted tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {visibleAssetCount} of {totalAssetCount}
            </p>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-10 shrink-0 rounded-md border border-line bg-panel px-4 text-sm font-medium text-fg transition-colors hover:border-faint disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

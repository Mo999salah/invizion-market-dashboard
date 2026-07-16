type MarketToolbarProps = Readonly<{
  searchQuery: string;
  visibleAssetCount: number;
  totalAssetCount: number;
  isRefreshing: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}>;

export function MarketToolbar({
  searchQuery,
  visibleAssetCount,
  totalAssetCount,
  isRefreshing,
  onSearchChange,
  onRefresh,
}: MarketToolbarProps) {
  return (
    <section
      aria-label="Market controls"
      className="flex flex-col gap-4 border-b border-zinc-800 p-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <label className="grid w-full max-w-md gap-2" htmlFor="market-search">
        <span className="text-sm font-medium text-zinc-300">Search assets</span>
        <input
          id="market-search"
          type="search"
          aria-controls="market-assets-table"
          aria-describedby="market-search-summary"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or symbol"
          autoComplete="off"
          className="h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <p
          id="market-search-summary"
          className="text-sm text-zinc-300"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing {visibleAssetCount} of {totalAssetCount}
        </p>

        <span
          className="inline-flex min-w-24 items-center gap-2 text-xs text-cyan-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {isRefreshing ? (
            <>
              <span
                aria-hidden="true"
                className="size-2 animate-pulse rounded-full bg-cyan-400"
              />
              Refreshing
            </>
          ) : null}
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-10 rounded-md border border-cyan-700 bg-cyan-950 px-4 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRefreshing ? "Refreshing…" : "Refresh market"}
        </button>
      </div>
    </section>
  );
}

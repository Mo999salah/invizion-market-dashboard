import { Button } from "@/shared/components/ui/Button";
import { Icon } from "@/shared/components/ui/Icon";
import { TextField } from "@/shared/components/ui/TextField";

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
    <div
      aria-label="Market controls"
      className="border-b border-line px-5 py-5 sm:px-6 lg:py-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs text-signal">Desk 01 / Digital assets</p>
          <h1 className="display-type text-2xl tracking-[-0.045em] text-fg sm:text-[2rem]">
            Digital Asset Monitor
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-ui">
            <span>Price discovery for the top 20 assets</span>
            <span aria-hidden="true" className="text-line">·</span>
            <span>USD</span>
            <span aria-hidden="true" className="text-line">·</span>
            <span>CoinGecko</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <TextField
            id="market-search"
            type="search"
            label="Search assets"
            labelVisuallyHidden
            reserveMessageSpace={false}
            wrapperClassName="w-full lg:w-64"
            aria-controls="market-watch-results"
            aria-describedby="market-search-summary"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Name or symbol"
            autoComplete="off"
            leadingIcon={<Icon name="search" size={17} />}
          />

          <div className="flex items-center gap-3 sm:gap-4">
            <p
              id="market-search-summary"
              className="whitespace-nowrap font-mono text-xs text-muted-ui tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {visibleAssetCount}/{totalAssetCount} instruments
            </p>

            <Button
              type="button"
              onClick={onRefresh}
              isLoading={isRefreshing}
              leadingIcon={<Icon name="refresh" size={16} />}
              size="lg"
            >
              {isRefreshing ? "Syncing…" : "Sync feed"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

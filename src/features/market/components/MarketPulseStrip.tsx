import {
  formatPercentage,
  formatSymbol,
  formatUsdPrice,
} from "@/features/market/formatters/marketFormatters";
import type { MarketAsset } from "@/features/market/types/marketAsset";

type MarketPulseStripProps = Readonly<{
  assets: readonly MarketAsset[];
}>;

function getChangeColor(value: number | null): string {
  if (value === null || value === 0) {
    return "text-muted-ui";
  }

  return value > 0 ? "text-gain" : "text-loss";
}

export function MarketPulseStrip({ assets }: MarketPulseStripProps) {
  const tapeAssets = assets.slice(0, 5);

  return (
    <div className="flex min-h-14 border-b border-line-soft bg-canvas">
      <div className="hidden w-32 shrink-0 items-center gap-2 border-r border-line-soft px-5 text-xs text-secondary sm:flex">
        <span aria-hidden="true" className="status-beacon size-1.5 bg-gain" />
        Market tape
      </div>
      <div className="market-tape flex min-w-0 flex-1 overflow-x-auto" aria-label="Leading market quotes">
        {tapeAssets.map((asset) => (
          <div
            key={asset.id}
            className="flex min-w-[11.5rem] flex-1 items-center justify-between gap-4 border-r border-line-soft px-4 py-2 last:border-r-0"
          >
            <span className="font-mono text-xs font-semibold text-secondary">
              {formatSymbol(asset.symbol)}
            </span>
            <span className="text-right font-mono text-xs tabular-nums text-fg">
              <span>{formatUsdPrice(asset.current_price)}</span>
              <span className={`ml-2 ${getChangeColor(asset.price_change_percentage_24h)}`}>
                {formatPercentage(asset.price_change_percentage_24h)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

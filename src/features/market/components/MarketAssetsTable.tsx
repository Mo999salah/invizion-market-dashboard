import {
  formatPercentage,
  formatSymbol,
  formatUsdPrice,
  formatUsdVolume,
} from "@/features/market/formatters/marketFormatters";
import type { MarketAsset } from "@/features/market/types/marketAsset";

type MarketAssetsTableProps = Readonly<{
  assets: readonly MarketAsset[];
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
}>;

function getChangeColor(value: number | null): string {
  if (value === null || value === 0) {
    return "text-zinc-300";
  }

  return value > 0 ? "text-emerald-400" : "text-rose-400";
}

function getChangeDirection(value: number | null): {
  symbol: string;
  label: string;
} {
  if (value === null) {
    return { symbol: "", label: "Not available" };
  }

  if (value === 0) {
    return { symbol: "", label: "No change" };
  }

  return value > 0
    ? { symbol: "▲", label: "Increase" }
    : { symbol: "▼", label: "Decrease" };
}

export function MarketAssetsTable({
  assets,
  selectedAssetId,
  onSelectAsset,
}: MarketAssetsTableProps) {
  if (assets.length === 0) {
    return (
      <div
        className="grid min-h-72 place-items-center p-6 text-center"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <h2 className="font-semibold text-zinc-200">No matching assets</h2>
          <p className="mt-1 text-sm text-zinc-300">
            Try a different asset name or symbol.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-400"
      role="region"
      aria-label="Scrollable market assets table"
      tabIndex={0}
    >
      <table
        id="market-assets-table"
        className="w-full min-w-[760px] border-collapse text-left text-sm"
      >
        <caption className="sr-only">
          Top cryptocurrencies ordered by market capitalization. Use each asset
          name button to show its details.
        </caption>
        <thead className="border-b border-zinc-800 bg-zinc-950/70 text-xs uppercase tracking-wide text-zinc-300">
          <tr>
            <th className="px-4 py-3 font-medium" scope="col">
              Asset name
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              Symbol
            </th>
            <th className="px-4 py-3 text-right font-medium" scope="col">
              Current price
            </th>
            <th className="px-4 py-3 text-right font-medium" scope="col">
              24h change
            </th>
            <th className="px-4 py-3 text-right font-medium" scope="col">
              24h volume
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/80">
          {assets.map((asset) => {
            const isSelected = asset.id === selectedAssetId;
            const changeDirection = getChangeDirection(
              asset.price_change_percentage_24h,
            );

            return (
              <tr
                key={asset.id}
                className={
                  isSelected
                    ? "relative bg-cyan-950/60 shadow-[inset_3px_0_0_0_rgb(34_211_238)] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-300"
                    : "relative bg-zinc-900/30 transition-colors hover:bg-zinc-800/80 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-300"
                }
              >
                <th className="p-0" scope="row">
                  <button
                    type="button"
                    onClick={() => onSelectAsset(asset.id)}
                    aria-pressed={isSelected}
                    aria-label={`${asset.name}${isSelected ? ", selected" : ", show details"}`}
                    className="w-full px-4 py-4 text-left font-medium text-zinc-100 outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    <span className="block max-w-48 truncate" title={asset.name}>
                      {asset.name}
                    </span>
                  </button>
                </th>
                <td className="px-4 py-4 font-mono text-xs text-zinc-400">
                  {formatSymbol(asset.symbol)}
                </td>
                <td className="px-4 py-4 text-right font-mono tabular-nums text-zinc-100">
                  {formatUsdPrice(asset.current_price)}
                </td>
                <td
                  className={`px-4 py-4 text-right font-mono tabular-nums ${getChangeColor(asset.price_change_percentage_24h)}`}
                >
                  <span className="sr-only">{changeDirection.label}: </span>
                  <span aria-hidden="true">
                    {changeDirection.symbol ? `${changeDirection.symbol} ` : ""}
                    {formatPercentage(asset.price_change_percentage_24h)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-mono tabular-nums text-zinc-300">
                  {formatUsdVolume(asset.total_volume)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

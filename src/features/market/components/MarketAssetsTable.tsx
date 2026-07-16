"use client";

import { useState } from "react";

import { AssetLogo } from "@/features/market/components/AssetLogo";
import {
  formatLastUpdated,
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
    return "text-muted";
  }

  return value > 0 ? "text-gain" : "text-loss";
}

function getChangeDirectionLabel(value: number | null): string {
  if (value === null) {
    return "Not available";
  }

  if (value === 0) {
    return "No change";
  }

  return value > 0 ? "Increase" : "Decrease";
}

function MobileAssetDetail({ asset }: { asset: MarketAsset }) {
  return (
    <div className="border-t border-line/40 bg-panel/60 px-5 py-4">
      <p className="font-mono text-xl font-medium text-fg tabular-nums">
        {formatUsdPrice(asset.current_price)}
      </p>
      <p className="mt-0.5 text-xs text-muted">Current price</p>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-xs text-faint">24h high</dt>
          <dd className="font-mono text-[0.8125rem] tabular-nums text-fg">
            {formatUsdPrice(asset.high_24h)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-faint">24h low</dt>
          <dd className="font-mono text-[0.8125rem] tabular-nums text-fg">
            {formatUsdPrice(asset.low_24h)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-faint">24h change</dt>
          <dd
            className={`font-mono text-[0.8125rem] tabular-nums ${getChangeColor(asset.price_change_percentage_24h)}`}
          >
            {formatPercentage(asset.price_change_percentage_24h)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-faint">Volume</dt>
          <dd className="font-mono text-[0.8125rem] tabular-nums text-fg">
            {formatUsdVolume(asset.total_volume)}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-faint">
        Updated {formatLastUpdated(asset.last_updated)}
      </p>
    </div>
  );
}

export function MarketAssetsTable({
  assets,
  selectedAssetId,
  onSelectAsset,
}: MarketAssetsTableProps) {
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);

  if (assets.length === 0) {
    return (
      <div
        className="grid min-h-72 place-items-center p-8 text-center"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <h2 className="text-base font-medium text-fg">No matching assets</h2>
          <p className="mt-1.5 text-sm text-muted">
            Try a different asset name or symbol.
          </p>
        </div>
      </div>
    );
  }

  function handleRowClick(assetId: string) {
    onSelectAsset(assetId);
    setMobileExpandedId((current) =>
      current === assetId ? null : assetId,
    );
  }

  return (
    <>
      <div
        className="hidden overflow-x-auto lg:block workspace-scroll focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        role="region"
        aria-label="Scrollable market assets table"
        tabIndex={0}
      >
        <table
          id="market-assets-table"
          className="w-full min-w-[680px] border-collapse text-left"
        >
          <caption className="sr-only">
            Top cryptocurrencies ordered by market capitalization. Use each asset
            name button to show its details.
          </caption>
          <thead className="border-b border-line text-xs text-faint">
            <tr>
              <th className="px-5 py-3 font-medium sm:px-6" scope="col">
                Asset
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                Symbol
              </th>
              <th className="px-4 py-3 text-right font-medium" scope="col">
                Price
              </th>
              <th className="px-4 py-3 text-right font-medium" scope="col">
                24h change
              </th>
              <th className="px-4 py-3 text-right font-medium sm:pr-6" scope="col">
                24h volume
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40">
            {assets.map((asset) => {
              const isSelected = asset.id === selectedAssetId;

              return (
                <tr
                  key={asset.id}
                  className={
                    isSelected
                      ? "relative bg-accent/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-accent"
                      : "relative transition-colors hover:bg-panel/60 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-accent"
                  }
                >
                  <th className="p-0" scope="row">
                    <button
                      type="button"
                      onClick={() => onSelectAsset(asset.id)}
                      aria-pressed={isSelected}
                      aria-label={`${asset.name}${isSelected ? ", selected" : ", show details"}`}
                      className="w-full px-5 py-3.5 text-left text-[0.9375rem] font-medium text-fg outline-none after:absolute after:inset-0 after:content-[''] sm:px-6"
                    >
                      <span className="flex max-w-48 items-center gap-3">
                        <AssetLogo src={asset.image} symbol={asset.symbol} />
                        <span className="min-w-0 truncate" title={asset.name}>
                          {asset.name}
                        </span>
                      </span>
                    </button>
                  </th>
                  <td className="px-4 py-3.5 font-mono text-xs text-faint">
                    {formatSymbol(asset.symbol)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-sm text-fg tabular-nums">
                    {formatUsdPrice(asset.current_price)}
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-mono text-sm tabular-nums ${getChangeColor(asset.price_change_percentage_24h)}`}
                  >
                    <span className="sr-only">
                      {getChangeDirectionLabel(asset.price_change_percentage_24h)}
                      :{" "}
                    </span>
                    {formatPercentage(asset.price_change_percentage_24h)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-sm text-muted tabular-nums sm:pr-6">
                    {formatUsdVolume(asset.total_volume)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden" role="list" aria-label="Market assets">
        {assets.map((asset) => {
          const isExpanded = mobileExpandedId === asset.id;

          return (
            <div key={asset.id} role="listitem">
              <button
                type="button"
                onClick={() => handleRowClick(asset.id)}
                aria-expanded={isExpanded}
                aria-label={`${asset.name}, ${formatUsdPrice(asset.current_price)}${isExpanded ? ", collapse details" : ", expand details"}`}
                className={`flex w-full items-center justify-between gap-3 border-b border-line/40 px-5 py-3.5 text-left transition-colors ${
                  isExpanded
                    ? "bg-accent/10"
                    : "hover:bg-panel/40"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <AssetLogo
                    src={asset.image}
                    symbol={asset.symbol}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] font-medium text-fg">
                      {asset.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-faint">
                      {formatSymbol(asset.symbol)}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[0.9375rem] text-fg tabular-nums">
                    {formatUsdPrice(asset.current_price)}
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-xs tabular-nums ${getChangeColor(asset.price_change_percentage_24h)}`}
                  >
                    {formatPercentage(asset.price_change_percentage_24h)}
                  </p>
                </div>
              </button>

              {isExpanded ? <MobileAssetDetail asset={asset} /> : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

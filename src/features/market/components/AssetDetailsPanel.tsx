import type { ReactNode } from "react";

import {
  formatLastUpdated,
  formatSymbol,
  formatUsdPrice,
  formatUsdVolume,
} from "@/features/market/formatters/marketFormatters";
import type { MarketAsset } from "@/features/market/types/marketAsset";

type AssetDetailsPanelProps = Readonly<{
  asset: MarketAsset;
}>;

type DetailItemProps = Readonly<{
  label: string;
  children: ReactNode;
  isFinancial?: boolean;
}>;

function DetailItem({ label, children, isFinancial = false }: DetailItemProps) {
  return (
    <div className="min-w-0 border-b border-zinc-800 pb-3 last:border-b-0 sm:last:border-b">
      <dt className="text-xs uppercase tracking-wide text-zinc-300">{label}</dt>
      <dd
        className={`mt-1 break-words text-sm text-zinc-100 ${
          isFinancial ? "font-mono tabular-nums" : ""
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

export function AssetDetailsPanel({ asset }: AssetDetailsPanelProps) {
  return (
    <aside
      aria-labelledby="asset-details-title"
      className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 lg:sticky lg:top-6"
    >
      <div className="border-b border-zinc-800 pb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-cyan-400">
          Selected asset
        </p>
        <h2
          id="asset-details-title"
          className="mt-1 break-words text-xl font-semibold"
          aria-live="polite"
          aria-atomic="true"
        >
          {asset.name}
        </h2>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <DetailItem label="Name">{asset.name}</DetailItem>
        <DetailItem label="Symbol" isFinancial>
          {formatSymbol(asset.symbol)}
        </DetailItem>
        <DetailItem label="Current price" isFinancial>
          {formatUsdPrice(asset.current_price)}
        </DetailItem>
        <DetailItem label="24h high" isFinancial>
          {formatUsdPrice(asset.high_24h)}
        </DetailItem>
        <DetailItem label="24h low" isFinancial>
          {formatUsdPrice(asset.low_24h)}
        </DetailItem>
        <DetailItem label="Volume" isFinancial>
          {formatUsdVolume(asset.total_volume)}
        </DetailItem>
        <DetailItem label="Last updated">
          {formatLastUpdated(asset.last_updated)}
        </DetailItem>
      </dl>
    </aside>
  );
}

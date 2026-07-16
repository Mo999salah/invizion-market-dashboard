import type { ReactNode } from "react";

import { AssetLogo } from "@/features/market/components/AssetLogo";
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

type DetailRowProps = Readonly<{
  label: string;
  children: ReactNode;
  isFinancial?: boolean;
}>;

function DetailRow({ label, children, isFinancial = false }: DetailRowProps) {
  return (
    <div className="flex min-w-0 items-baseline justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-muted-ui">{label}</dt>
      <dd
        className={`min-w-0 break-words text-right text-[0.9375rem] text-fg ${
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
      className="flex h-full flex-col px-6 py-7 lg:sticky lg:top-0"
    >
      <p className="text-sm font-medium text-muted-ui">
        Selected asset
      </p>
      <div
        className="mt-3 flex items-center gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <AssetLogo src={asset.image} symbol={asset.symbol} size="lg" />
        <h2
          id="asset-details-title"
          className="flex min-w-0 flex-wrap items-baseline gap-x-3 break-words text-xl font-bold tracking-[-0.025em]"
        >
          {asset.name}
          <span className="font-mono text-sm font-normal text-faint">
            {formatSymbol(asset.symbol)}
          </span>
        </h2>
      </div>

      <div className="mt-6 border-b border-line pb-6">
        <p className="text-sm text-muted-ui">Current price</p>
        <p className="mt-2 break-words font-mono text-3xl font-medium text-fg tabular-nums">
          {formatUsdPrice(asset.current_price)}
        </p>
      </div>

      <dl className="mt-1 divide-y divide-line-soft">
        <DetailRow label="24h high" isFinancial>
          {formatUsdPrice(asset.high_24h)}
        </DetailRow>
        <DetailRow label="24h low" isFinancial>
          {formatUsdPrice(asset.low_24h)}
        </DetailRow>
        <DetailRow label="Volume" isFinancial>
          {formatUsdVolume(asset.total_volume)}
        </DetailRow>
        <DetailRow label="Last updated">
          {formatLastUpdated(asset.last_updated)}
        </DetailRow>
      </dl>
    </aside>
  );
}

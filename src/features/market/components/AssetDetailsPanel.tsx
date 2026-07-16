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
      <dt className="shrink-0 text-sm text-muted">{label}</dt>
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
      className="flex h-full flex-col px-6 py-6 lg:sticky lg:top-0"
    >
      {/* ── Header: label + asset name ── */}
      <p className="text-xs font-medium uppercase tracking-widest text-faint">
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
          className="flex min-w-0 flex-wrap items-baseline gap-x-3 break-words text-xl font-semibold tracking-tight"
        >
          {asset.name}
          <span className="font-mono text-sm font-normal text-faint">
            {formatSymbol(asset.symbol)}
          </span>
        </h2>
      </div>

      {/* ── Hero price ── */}
      <div className="mt-5 border-b border-line/60 pb-5">
        <p className="text-sm text-muted">Current price</p>
        <p className="mt-1.5 break-words font-mono text-3xl font-medium text-fg tabular-nums">
          {formatUsdPrice(asset.current_price)}
        </p>
      </div>

      {/* ── Detail rows ── */}
      <dl className="mt-1 divide-y divide-line/40">
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

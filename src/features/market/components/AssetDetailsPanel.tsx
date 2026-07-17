import type { ReactNode } from "react";

import { AssetLogo } from "@/features/market/components/AssetLogo";
import {
  formatLastUpdated,
  formatPercentage,
  formatSymbol,
  formatUsdPrice,
  formatUsdVolume,
} from "@/features/market/formatters/marketFormatters";
import { getMarketChangeColorClass } from "@/features/market/presentation/marketChange";
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
  const change = asset.price_change_percentage_24h;
  const hasPriceRange =
    asset.current_price !== null &&
    asset.high_24h !== null &&
    asset.low_24h !== null &&
    asset.high_24h > asset.low_24h;
  const priceRangePosition = hasPriceRange
    ? Math.min(
        100,
        Math.max(
          0,
          ((asset.current_price! - asset.low_24h!) /
            (asset.high_24h! - asset.low_24h!)) *
            100,
        ),
      )
    : 50;
  const changeColor = getMarketChangeColorClass(change);

  return (
    <aside
      aria-labelledby="asset-details-title"
      className="flex h-full flex-col px-6 py-7 lg:sticky lg:top-0 lg:px-7"
    >
      <p className="text-xs text-signal">
        Instrument focus
      </p>
      <div
        className="mt-3 flex items-center gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <AssetLogo src={asset.image} symbol={asset.symbol} size="lg" />
        <h2
          id="asset-details-title"
          className="display-type flex min-w-0 flex-wrap items-baseline gap-x-3 break-words text-2xl tracking-[-0.04em]"
        >
          {asset.name}
          <span className="font-mono text-sm font-normal text-faint">
            {formatSymbol(asset.symbol)}
          </span>
        </h2>
      </div>

      <div className="mt-7 border-b border-line pb-7">
        <p className="text-sm text-muted-ui">Current price</p>
        <p className="mt-2 break-words font-mono text-[2rem] font-medium tracking-[-0.045em] text-fg tabular-nums xl:text-[2.35rem]">
          {formatUsdPrice(asset.current_price)}
        </p>
        <p className={`mt-2 font-mono text-sm tabular-nums ${changeColor}`}>
          {formatPercentage(change)} <span className="text-faint">/ 24h</span>
        </p>
      </div>

      <section className="border-b border-line py-6" aria-labelledby="price-range-title">
        <div className="flex items-baseline justify-between gap-4">
          <h3 id="price-range-title" className="text-sm font-medium text-secondary">
            24h price range
          </h3>
          <span className="font-mono text-xs text-faint tabular-nums">
            {Math.round(priceRangePosition)}%
          </span>
        </div>
        <div className="relative mt-5 h-1 bg-line" aria-hidden="true">
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-raised bg-signal"
            style={{ left: `${priceRangePosition}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between gap-4 font-mono text-xs tabular-nums">
          <span className="text-muted-ui">L {formatUsdPrice(asset.low_24h)}</span>
          <span className="text-secondary">H {formatUsdPrice(asset.high_24h)}</span>
        </div>
      </section>

      <dl className="divide-y divide-line-soft">
        <DetailRow label="Volume" isFinancial>
          {formatUsdVolume(asset.total_volume)}
        </DetailRow>
        <DetailRow label="Last updated">
          {formatLastUpdated(asset.last_updated)}
        </DetailRow>
      </dl>

      <p className="mt-auto border-t border-line pt-5 text-xs leading-5 text-faint">
        Quote currency USD. Market data supplied by CoinGecko.
      </p>
    </aside>
  );
}

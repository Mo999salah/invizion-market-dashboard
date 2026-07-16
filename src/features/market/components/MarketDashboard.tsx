"use client";

import { useMemo, useState } from "react";

import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { AssetDetailsPanel } from "@/features/market/components/AssetDetailsPanel";
import { MarketAssetsTable } from "@/features/market/components/MarketAssetsTable";
import {
  MarketEmptyState,
  MarketErrorState,
  MarketLoadingState,
} from "@/features/market/components/MarketStates";
import { MarketToolbar } from "@/features/market/components/MarketToolbar";
import { useMarketAssets } from "@/features/market/hooks/useMarketAssets";

export function MarketDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isManualRetrying, setIsManualRetrying] = useState(false);
  const {
    data,
    error,
    isError,
    isFetching,
    isPending,
    refetch,
  } = useMarketAssets();

  const assets = useMemo(() => data ?? [], [data]);
  const assetIds = useMemo(() => assets.map((asset) => asset.id), [assets]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    assetIds[0] ?? null,
  );
  const [previousAssetIds, setPreviousAssetIds] = useState(assetIds);

  let validSelectedAssetId = selectedAssetId;

  if (previousAssetIds !== assetIds) {
    setPreviousAssetIds(assetIds);

    if (
      validSelectedAssetId === null ||
      !assetIds.includes(validSelectedAssetId)
    ) {
      validSelectedAssetId = assetIds[0] ?? null;
      setSelectedAssetId(validSelectedAssetId);
    }
  }

  const filteredAssets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("en-US");

    if (normalizedQuery.length === 0) {
      return assets;
    }

    return assets.filter((asset) => {
      const normalizedName = asset.name.toLocaleLowerCase("en-US");
      const normalizedSymbol = asset.symbol.toLocaleLowerCase("en-US");

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedSymbol.includes(normalizedQuery)
      );
    });
  }, [assets, searchQuery]);

  const selectedAsset = useMemo(
    () =>
      assets.find((asset) => asset.id === validSelectedAssetId) ??
      assets[0] ??
      null,
    [assets, validSelectedAssetId],
  );

  const isInitialLoading =
    isPending && assets.length === 0 && !isManualRetrying;
  const isRefreshing = isFetching && !isInitialLoading;

  function refreshMarket() {
    void refetch();
  }

  function retryMarket() {
    setIsManualRetrying(true);
    void refetch().finally(() => setIsManualRetrying(false));
  }

  if (isInitialLoading) {
    return <MarketLoadingState />;
  }

  if ((isError || isManualRetrying) && assets.length === 0) {
    return (
      <MarketErrorState
        message={
          error?.message ?? "Retrying the CoinGecko market request."
        }
        isRetrying={isFetching || isManualRetrying}
        onRetry={retryMarket}
      />
    );
  }

  if (assets.length === 0) {
    return (
      <MarketEmptyState
        isRefreshing={isRefreshing}
        onRefresh={refreshMarket}
      />
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 font-sans text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">
                Invizion markets
              </p>
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wide text-zinc-300">
                Top 20 · USD
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Market dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Track the top 20 cryptocurrencies by market capitalization in
              USD.
            </p>
          </div>
          <div className="sm:pt-1">
            <LogoutButton />
          </div>
        </header>

        {isError ? (
          <div
            className="mb-4 rounded-md border border-amber-800 bg-amber-950/50 px-4 py-3 text-sm text-amber-200"
            role="alert"
          >
            <p className="font-medium">Market refresh failed</p>
            <p className="mt-1 text-amber-100">
              Showing the last successful market data.
            </p>
            <span className="sr-only"> {error.message}</span>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
          <section
            aria-label="Market watch"
            aria-busy={isRefreshing}
            className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40"
          >
            <MarketToolbar
              searchQuery={searchQuery}
              visibleAssetCount={filteredAssets.length}
              totalAssetCount={assets.length}
              isRefreshing={isRefreshing}
              onSearchChange={setSearchQuery}
              onRefresh={refreshMarket}
            />
            <MarketAssetsTable
              assets={filteredAssets}
              selectedAssetId={selectedAsset?.id ?? null}
              onSelectAsset={setSelectedAssetId}
            />
          </section>

          {selectedAsset ? <AssetDetailsPanel asset={selectedAsset} /> : null}
        </div>
      </div>
    </main>
  );
}

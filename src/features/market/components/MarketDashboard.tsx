"use client";

import { useState } from "react";

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
import { AppTopBar } from "@/shared/components/ui/AppTopBar";

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

  const assets = data ?? [];
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("en-US");
  const filteredAssets = normalizedQuery
    ? assets.filter((asset) => {
        const normalizedName = asset.name.toLocaleLowerCase("en-US");
        const normalizedSymbol = asset.symbol.toLocaleLowerCase("en-US");

        return (
          normalizedName.includes(normalizedQuery) ||
          normalizedSymbol.includes(normalizedQuery)
        );
      })
    : assets;
  const selectedAsset =
    filteredAssets.find((asset) => asset.id === selectedAssetId) ??
    filteredAssets[0] ??
    null;

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
    <main className="flex min-h-dvh flex-col bg-canvas font-sans text-fg">
      <AppTopBar>
        <LogoutButton />
      </AppTopBar>

      <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface">
          <MarketToolbar
            searchQuery={searchQuery}
            visibleAssetCount={filteredAssets.length}
            totalAssetCount={assets.length}
            isRefreshing={isRefreshing}
            onSearchChange={setSearchQuery}
            onRefresh={refreshMarket}
          />

          {isError ? (
            <div
              className="border-b border-line bg-raised px-5 py-3 text-sm sm:px-6"
              role="alert"
            >
              <p>
                <span className="font-semibold text-signal">
                  Market refresh failed.
                </span>{" "}
                <span className="text-muted-ui">
                  Showing the last successful market data.
                </span>
              </p>
              <span className="sr-only"> {error.message}</span>
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <section
              id="market-watch-results"
              aria-label="Market watch"
              aria-busy={isRefreshing}
              className="min-h-0 min-w-0 flex-1 overflow-y-auto workspace-scroll lg:basis-[62%]"
            >
              <MarketAssetsTable
                assets={filteredAssets}
                selectedAssetId={selectedAsset?.id ?? null}
                onSelectAsset={setSelectedAssetId}
              />
            </section>

            {selectedAsset ? (
              <div className="hidden border-l border-line bg-raised lg:block lg:basis-[38%]">
                <AssetDetailsPanel asset={selectedAsset} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

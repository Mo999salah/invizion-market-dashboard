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
    <main className="flex min-h-screen flex-col bg-ink font-sans text-fg">
      <AppTopBar>
        <LogoutButton />
      </AppTopBar>

      {/* ── Bounded workspace container ── */}
      <div className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        {/* ── Workspace card ── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-panel/30">
          {/* ── Command bar ── */}
          <MarketToolbar
            searchQuery={searchQuery}
            visibleAssetCount={filteredAssets.length}
            totalAssetCount={assets.length}
            isRefreshing={isRefreshing}
            onSearchChange={setSearchQuery}
            onRefresh={refreshMarket}
          />

          {/* ── Stale data alert ── */}
          {isError ? (
            <div
              className="border-b border-line bg-accent/5 px-5 py-3 text-sm sm:px-6"
              role="alert"
            >
              <p className="border-l-2 border-accent pl-3">
                <span className="font-medium text-accent">
                  Market refresh failed.
                </span>{" "}
                <span className="text-muted">
                  Showing the last successful market data.
                </span>
              </p>
              <span className="sr-only"> {error.message}</span>
            </div>
          ) : null}

          {/* ── Content area: table + inspector ── */}
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            {/* ── Table pane (≈62%) ── */}
            <section
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

            {/* ── Inspector pane (≈38%) — hidden on mobile (accordion in table) ── */}
            {selectedAsset ? (
              <div className="hidden border-l border-line bg-panel/20 lg:block lg:basis-[38%]">
                <AssetDetailsPanel asset={selectedAsset} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

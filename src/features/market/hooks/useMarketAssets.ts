"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchMarketAssets } from "@/features/market/api/fetchMarketAssets";
import { marketQueryKeys } from "@/features/market/queries/marketQueryKeys";

const MARKET_STALE_TIME_MS = 60_000;

export function useMarketAssets() {
  return useQuery({
    queryKey: marketQueryKeys.assets,
    queryFn: ({ signal }) => fetchMarketAssets(signal),
    staleTime: MARKET_STALE_TIME_MS,
    retry: 1,
    placeholderData: keepPreviousData,
  });
}

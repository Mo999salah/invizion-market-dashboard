"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchMarketAssets } from "@/features/market/api/fetchMarketAssets";

const MARKET_STALE_TIME_MS = 60_000;

export function useMarketAssets() {
  return useQuery({
    queryKey: ["market", "assets"],
    queryFn: ({ signal }) => fetchMarketAssets(signal),
    staleTime: MARKET_STALE_TIME_MS,
    retry: 1,
  });
}

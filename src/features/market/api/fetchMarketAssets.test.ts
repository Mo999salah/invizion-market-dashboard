import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchMarketAssets } from "./fetchMarketAssets";

const coinGeckoAsset = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: "https://example.com/bitcoin.png",
  current_price: 67_524.4,
  price_change_percentage_24h: 2.34,
  total_volume: 32_000_000_000,
  high_24h: 68_000,
  low_24h: 65_500,
  last_updated: "2026-07-16T12:00:00.000Z",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchMarketAssets", () => {
  it("returns validated market data", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([coinGeckoAsset]), {
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchMarketAssets()).resolves.toEqual([coinGeckoAsset]);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toContain(
      "api.coingecko.com/api/v3/coins/markets",
    );
  });

  it("reports API failures with their status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 429,
          statusText: "Too Many Requests",
        }),
      ),
    );

    await expect(fetchMarketAssets()).rejects.toThrow(
      "CoinGecko market request failed with status 429 Too Many Requests.",
    );
  });

  it("rejects an unexpected response shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: [coinGeckoAsset] })),
      ),
    );

    await expect(fetchMarketAssets()).rejects.toThrow(
      "expected an array of assets",
    );
  });
});

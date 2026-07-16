import type { MarketAsset } from "@/features/market/types/marketAsset";

const COINGECKO_MARKETS_ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets";

const MARKET_QUERY_PARAMS = new URLSearchParams({
  vs_currency: "usd",
  order: "market_cap_desc",
  per_page: "20",
  page: "1",
  sparkline: "false",
  price_change_percentage: "24h",
});

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  asset: UnknownRecord,
  field: keyof MarketAsset,
  index: number,
): string {
  const value = asset[field];

  if (typeof value !== "string") {
    throw new Error(
      `Invalid CoinGecko market response: item ${index} has an invalid ${field} field.`,
    );
  }

  return value;
}

function readNullableNumber(
  asset: UnknownRecord,
  field: keyof MarketAsset,
  index: number,
): number | null {
  const value = asset[field];

  if (value === null) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(
      `Invalid CoinGecko market response: item ${index} has an invalid ${field} field.`,
    );
  }

  return value;
}

function parseMarketAsset(value: unknown, index: number): MarketAsset {
  if (!isRecord(value)) {
    throw new Error(
      `Invalid CoinGecko market response: item ${index} is not an object.`,
    );
  }

  return {
    id: readString(value, "id", index),
    name: readString(value, "name", index),
    symbol: readString(value, "symbol", index),
    image: readString(value, "image", index),
    current_price: readNullableNumber(value, "current_price", index),
    price_change_percentage_24h: readNullableNumber(
      value,
      "price_change_percentage_24h",
      index,
    ),
    total_volume: readNullableNumber(value, "total_volume", index),
    high_24h: readNullableNumber(value, "high_24h", index),
    low_24h: readNullableNumber(value, "low_24h", index),
    last_updated: readString(value, "last_updated", index),
  };
}

export async function fetchMarketAssets(
  signal?: AbortSignal,
): Promise<MarketAsset[]> {
  const response = await fetch(
    `${COINGECKO_MARKETS_ENDPOINT}?${MARKET_QUERY_PARAMS.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
      signal,
    },
  );

  if (!response.ok) {
    const status = response.statusText
      ? `${response.status} ${response.statusText}`
      : String(response.status);

    throw new Error(`CoinGecko market request failed with status ${status}.`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "Invalid CoinGecko market response: expected an array of assets.",
    );
  }

  return data.map(parseMarketAsset);
}

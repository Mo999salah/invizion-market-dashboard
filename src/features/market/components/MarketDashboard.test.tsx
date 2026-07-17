/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMarketAssets } from "@/features/market/hooks/useMarketAssets";
import type { MarketAsset } from "@/features/market/types/marketAsset";

import { MarketDashboard } from "./MarketDashboard";

vi.mock("@/features/market/hooks/useMarketAssets", () => ({
  useMarketAssets: vi.fn(),
}));

vi.mock("@/features/auth/components/LogoutButton", () => ({
  LogoutButton: () => <button type="button">Log out</button>,
}));

const marketAssets: MarketAsset[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67_524.4,
    price_change_percentage_24h: 2.34,
    total_volume: 32_000_000_000,
    high_24h: 68_000,
    low_24h: 65_500,
    last_updated: "2026-07-16T12:00:00.000Z",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3_420.75,
    price_change_percentage_24h: -1.2,
    total_volume: 18_000_000_000,
    high_24h: 3_500,
    low_24h: 3_390,
    last_updated: "2026-07-16T12:00:00.000Z",
  },
];

type MarketQueryResult = ReturnType<typeof useMarketAssets>;

function createQueryResult(
  overrides: Partial<MarketQueryResult> = {},
): MarketQueryResult {
  return {
    data: marketAssets,
    error: null,
    isError: false,
    isFetching: false,
    isPending: false,
    refetch: vi.fn().mockResolvedValue({ data: marketAssets }),
    ...overrides,
  } as MarketQueryResult;
}

const mockedUseMarketAssets = vi.mocked(useMarketAssets);

beforeEach(() => {
  mockedUseMarketAssets.mockReturnValue(createQueryResult());
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("MarketDashboard", () => {
  it("filters assets and updates the selected details", async () => {
    const user = userEvent.setup();

    render(<MarketDashboard />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Bitcoin/ }),
    ).toBeTruthy();

    await user.click(
      screen.getByRole("button", { name: "Ethereum, show details" }),
    );
    expect(
      screen.getByRole("heading", { level: 2, name: /Ethereum/ }),
    ).toBeTruthy();

    await user.type(screen.getByRole("searchbox", { name: "Search assets" }), "btc");

    expect(screen.queryByText("Ethereum")).toBeNull();
    expect(screen.getAllByText("Bitcoin").length).toBeGreaterThan(0);
    expect(screen.getByText("1/2 instruments")).toBeTruthy();
  });

  it("calls the market refetch action", async () => {
    const refetch = vi.fn().mockResolvedValue({ data: marketAssets });
    mockedUseMarketAssets.mockReturnValue(createQueryResult({ refetch }));
    const user = userEvent.setup();

    render(<MarketDashboard />);
    await user.click(screen.getByRole("button", { name: "Sync feed" }));

    expect(refetch).toHaveBeenCalledOnce();
  });

  it("disables the refresh action while data is being fetched", () => {
    mockedUseMarketAssets.mockReturnValue(
      createQueryResult({ isFetching: true }),
    );

    render(<MarketDashboard />);

    const refreshButton = screen.getByRole("button", { name: "Syncing…" });
    expect((refreshButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("renders the initial loading state", () => {
    mockedUseMarketAssets.mockReturnValue(
      createQueryResult({ data: undefined, isPending: true }),
    );

    render(<MarketDashboard />);

    expect(screen.getByText("Loading market data from CoinGecko.")).toBeTruthy();
  });

  it("renders an actionable error state when no cached data exists", () => {
    mockedUseMarketAssets.mockReturnValue(
      createQueryResult({
        data: undefined,
        error: new Error("CoinGecko is unavailable"),
        isError: true,
      }),
    );

    render(<MarketDashboard />);

    expect(
      screen.getByRole("heading", { name: "Market data is unavailable" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });
});

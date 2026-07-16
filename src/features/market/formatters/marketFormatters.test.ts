import { describe, expect, it } from "vitest";

import {
  formatLastUpdated,
  formatPercentage,
  formatSymbol,
  formatUsdPrice,
  formatUsdVolume,
} from "./marketFormatters";

describe("market formatters", () => {
  it("formats prices without hiding useful precision", () => {
    expect(formatUsdPrice(67524.4)).toBe("$67,524.40");
    expect(formatUsdPrice(0.00001234)).toBe("$0.00001234");
    expect(formatUsdPrice(null)).toBe("—");
  });

  it("formats percentages, volumes, and symbols", () => {
    expect(formatPercentage(2.345)).toBe("+2.35%");
    expect(formatPercentage(-1.2)).toBe("-1.20%");
    expect(formatUsdVolume(1_250_000)).toBe("$1.25M");
    expect(formatSymbol("btc")).toBe("BTC");
  });

  it("returns a fallback for missing or invalid timestamps", () => {
    expect(formatLastUpdated(null)).toBe("—");
    expect(formatLastUpdated("not-a-date")).toBe("—");
  });
});

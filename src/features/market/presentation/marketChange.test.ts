import { describe, expect, it } from "vitest";

import {
  getMarketChangeColorClass,
  getMarketChangeDirectionLabel,
} from "./marketChange";

describe("market change presentation", () => {
  it.each([
    [2.5, "text-gain", "Increase"],
    [-1.2, "text-loss", "Decrease"],
    [0, "text-muted-ui", "No change"],
    [null, "text-muted-ui", "Not available"],
  ])("maps %s to its visual and accessible states", (value, color, label) => {
    expect(getMarketChangeColorClass(value)).toBe(color);
    expect(getMarketChangeDirectionLabel(value)).toBe(label);
  });
});

const EMPTY_VALUE = "—";

const usdPriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const smallUsdPriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

const usdVolumeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 2,
});

const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatUsdPrice(value: number | null): string {
  if (value === null) {
    return EMPTY_VALUE;
  }

  const formatter = Math.abs(value) > 0 && Math.abs(value) < 1
    ? smallUsdPriceFormatter
    : usdPriceFormatter;

  return formatter.format(value);
}

export function formatUsdVolume(value: number | null): string {
  return value === null ? EMPTY_VALUE : usdVolumeFormatter.format(value);
}

export function formatPercentage(value: number | null): string {
  return value === null ? EMPTY_VALUE : percentageFormatter.format(value / 100);
}

export function formatLastUpdated(value: string | null): string {
  if (value === null) {
    return EMPTY_VALUE;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? EMPTY_VALUE : dateTimeFormatter.format(date);
}

export function formatSymbol(symbol: string): string {
  return symbol.toLocaleUpperCase("en-US");
}

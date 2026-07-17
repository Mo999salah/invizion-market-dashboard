export function getMarketChangeColorClass(value: number | null): string {
  if (value === null || value === 0) {
    return "text-muted-ui";
  }

  return value > 0 ? "text-gain" : "text-loss";
}

export function getMarketChangeDirectionLabel(value: number | null): string {
  if (value === null) {
    return "Not available";
  }

  if (value === 0) {
    return "No change";
  }

  return value > 0 ? "Increase" : "Decrease";
}

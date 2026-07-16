export type MarketAsset = {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly image: string;
  readonly current_price: number | null;
  readonly price_change_percentage_24h: number | null;
  readonly total_volume: number | null;
  readonly high_24h: number | null;
  readonly low_24h: number | null;
  readonly last_updated: string;
};

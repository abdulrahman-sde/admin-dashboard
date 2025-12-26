export interface ProductStatsResult {
  all: number;
  featured: number;
  onSale: number;
  outOfStock: number;
}
export interface ProductStatsFacetResult {
  total: Array<{ count: number }>;
  featured: Array<{ count: number }>;
  onSale: Array<{ count: number }>;
  outOfStock: Array<{ count: number }>;
}

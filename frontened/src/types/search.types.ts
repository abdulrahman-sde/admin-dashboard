export interface SearchResult {
  id: string;
  type: "product" | "category" | "customer";
  name: string;
  pic: string | null;
}

export interface SearchResponse {
  success: boolean;
  message: string;
  data: SearchResult[];
}

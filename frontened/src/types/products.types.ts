import type { PaginatedApiResponseWithMeta } from "./shared.types";

export interface Category {
  id?: string;
  _id?: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  costPrice: number;
  discountPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isUnlimitedStock: boolean;
  images: string[];
  thumbnail: string;
  categoryId: string;
  tags: string[];
  colors: string[];
  totalSales: number;
  totalRevenue: number;
  viewCount: number;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | string;
  isFeatured: boolean;
  averageRating: number;
  ratingCount: number;
  expirationStart?: string;
  expirationEnd?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: Category;
}

export interface Meta {
  all: number;
  featured: number;
  onSale: number;
  outOfStock: number;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
  isFeatured?: boolean;
  hasDiscount?: boolean;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  sortBy?: "createdAt" | "price" | "stockQuantity" | "totalSales" | "name";
  sortOrder?: "asc" | "desc";
}
export type GetProductsResponse = PaginatedApiResponseWithMeta<Product[], Meta>;

export type ProductListItem = {
  id: number;
  name: string;
  category: string;
  image: string;
  inventory: string;
  color: string;
  price: string;
  rating: string;
  inStock: boolean;
};

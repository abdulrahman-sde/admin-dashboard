import type { ApiResponse } from "./shared.types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  sortOrder: number;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count: {
    products: number;
  };
}

export type CategoriesResponse = ApiResponse<Category[]>;

export type CategoryCardProps = {
  category: Category;
};

export type CategoryProduct = {
  id: number | string;
  name: string;
  image: string;
  price?: number;
  stock?: number;
};

export type CategoryData = {
  id?: string;
  name: string;
  image: string;
  visibility: boolean;
  products: CategoryProduct[];
};

export type EditCategoryProps = {
  initialData?: CategoryData;
};

export interface QuickAddProductInput {
  name: string;
  image: File | null;
  price: number;
  stock: number;
  description: string;
}

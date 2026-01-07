import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function generatePagination(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export function getCustomerStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "text-rise";
    case "INACTIVE":
      return "text-destructive";
    case "VIP":
      return "text-warning";
    default:
      return "text-destructive";
  }
}

export function getOrderStatusColor(status: string) {
  switch (status) {
    case "DELIVERED":
      return "text-[#21C45D]";
    case "PENDING":
      return "text-[#F59F0A]";
    case "SHIPPED":
    case "PROCESSING":
      return "text-black";
    case "CANCELED":
      return "text-[#EF4343]";
    default:
      return "text-muted-foreground";
  }
}

export function getTransactionStatusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "text-[#21C45D]";
    case "FAILED":
      return "text-[#EF4343]";
    case "PENDING":
      return "text-[#FBBD23]";
    case "REFUNDED":
      return "text-orange-400";
    default:
      return "text-gray-500";
  }
}

export function getProductImage(item: any): string {
  if (!item) return "https://via.placeholder.com/48?text=No+Img";
  return (
    item.productImage ||
    item.product?.thumbnail ||
    item.product?.images?.[0] ||
    item.product?.image ||
    item.image ||
    "https://via.placeholder.com/48?text=No+Img"
  );
}

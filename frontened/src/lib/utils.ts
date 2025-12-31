import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Helper Function logic (usually put in utils or component)
export function generatePagination(currentPage: number, totalPages: number) {
  // If total pages is small, show all
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If current page is near the start (e,g. 1, 2, 3)
  // Show 1, 2, 3, 4, ..., 20
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  // If current page is near the end (e.g. 18, 19, 20)
  // Show 1, ..., 17, 18, 19, 20
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

  // If somewhere in the middle (e.g. 10)
  // Show 1, ..., 9, 10, 11, ..., 20
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

// Status color utilities
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

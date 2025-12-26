import { useState } from "react";
import { useGetAllReviewsQuery } from "@/lib/store/services/reviews/reviewsApi";

export const useReviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, isFetching } = useGetAllReviewsQuery({
    page: currentPage,
    limit,
  });

  const reviews = data?.data || [];
  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages || 1;

  // Generate page numbers for pagination
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return {
    reviews,
    pagination,
    isLoading,
    isError,
    isFetching,
    currentPage,
    setCurrentPage,
    pages: getPages(),
  };
};

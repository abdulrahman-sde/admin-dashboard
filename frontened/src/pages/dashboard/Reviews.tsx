"use client";

import { useReviews } from "@/hooks/reviews/useReviews";
import { Star, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductsTableSkeleton } from "@/components/shared/skeletons";
import { format } from "date-fns";

export default function Reviews() {
  const {
    reviews,
    pagination,
    isError,
    isFetching,
    currentPage,
    setCurrentPage,
    pages,
  } = useReviews();

  return (
    <div className="space-y-6 px-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827]">
          Customer Reviews
        </h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden min-h-[300px]">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="[&_th]:pt-8 [&_th]:pb-3 text-[14px] [&_th]:text-muted-foreground">
              <TableHead className="ps-8">Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[40%]">Comment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[14px]">
            {isFetching ? (
              <ProductsTableSkeleton rows={10} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-red-500 gap-2">
                    <AlertCircle className="h-8 w-8" />
                    <p className="font-medium">Failed to load reviews</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-20 text-muted-foreground"
                >
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow
                  key={review.id}
                  className="border-b inter-regular border-[#E5E7EB] hover:bg-[#F9FAFB] [&_td]:py-3 [&_td]:text-table-text-color [&_td]:inter-regular"
                >
                  <TableCell className="ps-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {review.product?.thumbnail ? (
                          <img
                            src={review.product.thumbnail}
                            alt={review.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-[10px] text-gray-400">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-[#111827] line-clamp-1 max-w-[150px]">
                        {review.product?.name || "Deleted Product"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {review.customer?.avatar ? (
                          <img
                            src={review.customer.avatar}
                            alt={review.customer.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <span className="text-[#111827]">
                        {review.customer
                          ? `${review.customer.firstName} ${review.customer.lastName}`
                          : "Anonymous"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-[#111827]">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#6B7280]">
                    <p className="line-clamp-2 max-w-[400px]">
                      {review.comment || (
                        <span className="italic opacity-50 text-xs">
                          No comment provided
                        </span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell className="text-[#6B7280]">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 border-[#E5E7EB]"
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {pages.map((page, index) => (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              disabled={page === "..."}
              className={`h-8 w-8 p-0 ${
                currentPage === page
                  ? "bg-[#4EA674] hover:bg-[#3d8a5e]"
                  : "text-[#6B7280] border-transparent"
              }`}
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage(
              Math.min(pagination?.totalPages || 1, currentPage + 1)
            )
          }
          disabled={currentPage === (pagination?.totalPages || 1)}
          className="h-8 border-[#E5E7EB]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

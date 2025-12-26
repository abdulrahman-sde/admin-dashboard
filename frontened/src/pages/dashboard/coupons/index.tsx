import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Ticket,
  Truck,
  Trash2,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useCoupons } from "@/hooks/coupons/useCoupons";
import { format } from "date-fns";
import { CouponsTableSkeleton as CouponsSkeleton } from "@/components/shared/skeletons";
import { DataTableEmptyState } from "@/components/shared/DataTableEmptyState";

import type { CouponStatus } from "@/types/coupons.types";

import { DeleteConfirmationModal } from "@/components/shared/DeleteConfirmationModal";

import { useCouponDelete } from "@/hooks/coupons/useCouponDelete";

export default function Coupons() {
  const navigate = useNavigate();
  const {
    coupons,
    pagination,
    isFetching,
    currentPage,
    pages,
    setCurrentPage,
    setStatus,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedIds,
    handleCheckboxChange,
    handleSelectAll,
    resetSelection,
  } = useCoupons();

  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleBulkDelete,
    isDeleting,
  } = useCouponDelete(selectedIds, resetSelection);

  const handleStatusChange = (value: string) => {
    if (value === "ALL") {
      setStatus(undefined);
    } else {
      setStatus(value as CouponStatus);
    }
  };

  const handleSort = (
    field: "createdAt" | "startDate" | "endDate" | "usageCount"
  ) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="p-2 font-inter">
      <div className=" space-y-6 -mt-3">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-bold ">Coupons</h1>
          <Button
            className="bg-primary text-white w-[118px] h-10 text-sm font-medium flex items-center gap-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            onClick={() => navigate("/dashboard/coupons/add")}
            disabled={selectedIds.length > 0}
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>

        <div className="bg-white rounded-lg pt-3 px-2 overflow-hidden">
          {/* Navigation Tabs */}
          <div className="px-6  pb-2 border-gray-100">
            <Tabs
              defaultValue="ALL"
              onValueChange={handleStatusChange}
              className="w-full"
            >
              <TabsList className="bg-transparent h-14 pt-4 flex justify-start gap-8 border-none">
                <TabsTrigger
                  value="ALL"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#48A878] data-[state=active]:bg-transparent data-[state=active]:text-[#48A878] text-[#5A607F] px-0  transition-all shadow-none"
                >
                  All Coupons
                </TabsTrigger>
                <TabsTrigger
                  value="ACTIVE"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#48A878] data-[state=active]:bg-transparent data-[state=active]:text-[#48A878] text-[#5A607F] px-0  transition-all shadow-none"
                >
                  Active Coupons
                </TabsTrigger>
                <TabsTrigger
                  value="EXPIRED"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#48A878] data-[state=active]:bg-transparent data-[state=active]:text-[#48A878] text-[#5A607F] px-0  transition-all shadow-none"
                >
                  Expired Coupons
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Toolbar */}
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedIds.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground font-medium">
                    {selectedIds.length} Selected
                  </div>
                </div>
              ) : (
                <>
                  <div className="">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className={`h-10 w-10 border-gray-200 rounded-lg focus:ring-0 shadow-none text-gray-500 hover:text-primary transition-all ${
                            sortBy && sortBy !== "createdAt"
                              ? "border-primary bg-primary/5 text-primary"
                              : ""
                          }`}
                        >
                          <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-48 border-[#E5E7EB] shadow-xl"
                      >
                        <DropdownMenuItem
                          onClick={() => handleSort("startDate")}
                          className="flex items-center justify-between"
                        >
                          Start Date
                          {sortBy === "startDate" &&
                            (sortOrder === "asc" ? (
                              <ArrowUp className="size-3" />
                            ) : (
                              <ArrowDown className="size-3" />
                            ))}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSort("endDate")}
                          className="flex items-center justify-between"
                        >
                          End Date
                          {sortBy === "endDate" &&
                            (sortOrder === "asc" ? (
                              <ArrowUp className="size-3" />
                            ) : (
                              <ArrowDown className="size-3" />
                            ))}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSort("usageCount")}
                          className="flex items-center justify-between"
                        >
                          Usage
                          {sortBy === "usageCount" &&
                            (sortOrder === "asc" ? (
                              <ArrowUp className="size-3" />
                            ) : (
                              <ArrowDown className="size-3" />
                            ))}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSort("createdAt")}
                          className="flex items-center justify-between"
                        >
                          Created Date
                          {sortBy === "createdAt" &&
                            (sortOrder === "asc" ? (
                              <ArrowUp className="size-3" />
                            ) : (
                              <ArrowDown className="size-3" />
                            ))}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="relative w-[320px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7E84A3]" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="pl-10 h-10 border-gray-200 placeholder:text-[#7E84A3] rounded-lg text-sm"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-10 px-4"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedIds.length})
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-gray-200 text-primary  hover:border-destructive rounded-sm transition-all"
                  disabled
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto">
            <Table className="min-w-[1000px] table-fixed">
              <TableHeader>
                <TableRow className="border-b border-gray-50 hover:bg-transparent [&_th]:text-[#5A607F]">
                  <TableHead className="pl-6 ">
                    <Checkbox
                      className="rounded border-gray-300 size-4.5 "
                      checked={
                        coupons.length > 0 &&
                        selectedIds.length === coupons.length
                      }
                      onCheckedChange={() =>
                        handleSelectAll(coupons.map((c) => c.id))
                      }
                    />
                  </TableHead>
                  <TableHead className="text-[14px] w-[40%] pl-2">
                    Coupon Name
                  </TableHead>
                  <TableHead className="text-[14px] text-center w-[15%]">
                    Usage
                  </TableHead>
                  <TableHead className="text-[14px] text-center w-[15%]">
                    Status
                  </TableHead>
                  <TableHead className="text-[14px] w-[25%]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-table-text-color">
                {isFetching ? (
                  <CouponsSkeleton />
                ) : coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <TableRow
                      key={coupon.id}
                      className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors h-20"
                    >
                      <TableCell className="pl-6 pr-0">
                        <Checkbox
                          className="rounded border-gray-300 size-4.5 "
                          checked={selectedIds.includes(coupon.id)}
                          onCheckedChange={() =>
                            handleCheckboxChange(coupon.id)
                          }
                        />
                      </TableCell>
                      <TableCell className="pl-2">
                        <div className="flex items-center gap-4 py-2 ">
                          <div
                            className={`size-12 rounded flex items-center justify-center shrink-0 ${
                              coupon.type === "FREE_SHIPPING"
                                ? "bg-[#7E84A3]"
                                : "bg-[#48A878]"
                            }`}
                          >
                            {coupon.type === "FREE_SHIPPING" ? (
                              <Truck className="h-5 w-5 text-white" />
                            ) : (
                              <Ticket className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-[14px] font-medium ">
                              {coupon.name}
                            </div>
                            <div className="text-[13px] text-[#7E84A3]  uppercase tracking-tight">
                              {coupon.code}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span>
                          {coupon.usageCount} <span>times</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <span
                            className={`px-2.5 py-1 text-[14px] rounded-[6px] h-7  inline-block ${
                              coupon.status === "ACTIVE"
                                ? "bg-[#C4F8E2] text-[#06A561]"
                                : "bg-[#E6E9F4] text-[#5A607F]"
                            }`}
                          >
                            {coupon.status === "ACTIVE" ? "Active" : "Expired"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(coupon.startDate), "MMMM d, yyyy")} -{" "}
                        {coupon.endDate
                          ? format(new Date(coupon.endDate), "MMMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <DataTableEmptyState colSpan={5} message="No coupons found" />
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50 bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {pages.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => typeof p === "number" && setCurrentPage(p)}
                    className={`w-8 h-8 rounded-md text-[13px] font-bold transition-all ${
                      currentPage === p
                        ? "bg-[#ECF2FF] text-[#4EA674]"
                        : "text-[#7E84A3] hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(pages.length, currentPage + 1))
                }
                disabled={currentPage === pages.length}
                className="p-1.5 text-gray-400 hover:text-gray-900 disabled:hover:text-gray-400 disabled:opacity-30 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="text-[13px] text-[#7E84A3] font-bold">
              {pagination?.total || 0} Results
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleBulkDelete}
        title="Delete Coupons"
        description={`Are you sure you want to delete ${selectedIds.length} coupons? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}

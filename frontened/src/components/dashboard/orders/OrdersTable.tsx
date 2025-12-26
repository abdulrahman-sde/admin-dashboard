import { Card } from "@/components/ui/card";
import { DataTableEmptyState } from "@/components/shared/DataTableEmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MoreVertical,
  Check,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import { OrdersTableSkeleton } from "@/components/shared/skeletons";
import type {
  OrderListItem,
  OrderStatus,
  PaymentStatus,
} from "@/types/orders.types";
import { getOrderStatusColor } from "@/lib/utils";

interface OrdersTableProps {
  data: OrderListItem[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  pages: (number | string)[];
  onPageChange: (page: number) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  statusCounts?: {
    all: number;
    completed: number;
    pending: number;
    cancelled: number;
  };
  sortBy?: string;
  setSortBy?: (value: string) => void;
  sortOrder?: "asc" | "desc";
  setSortOrder?: (value: "asc" | "desc") => void;
  paymentStatus?: PaymentStatus;
  onPaymentStatusChange?: (status: PaymentStatus | undefined) => void;
}

export function OrdersTable({
  data,
  currentPage,
  totalPages,
  totalOrders,
  pages,
  onPageChange,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  isLoading,
  statusCounts,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  paymentStatus,
  onPaymentStatusChange,
}: OrdersTableProps) {
  const toggleSort = (field: string) => {
    if (!setSortBy || !setSortOrder) return;
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return (
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        );
      case "PENDING":
        return (
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "SHIPPED":
      case "PROCESSING":
        return (
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-6m4 6v-6m10 6a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-6m4 6v-6" />
          </svg>
        );
      case "CANCELED":
        return (
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatStatus = (status: OrderStatus) => {
    if (!status) return "N/A";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <Card className="p-0 border-[#D1D5DB]">
      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
        <div className="p-4 pb-3 border-b border-[#D1D5DB]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Standard Radix Tabs */}
            <TabsList className="h-auto p-1 bg-fade-green rounded-lg border-none">
              <TabsTrigger
                value="all"
                className="px-4 py-1.5 text-sm z-30 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                All order
                <span className="text-primary ml-1">
                  ({statusCounts?.all ?? totalOrders})
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="px-4 py-1.5 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Completed{" "}
                <span className="text-primary ml-1">
                  ({statusCounts?.completed ?? 0})
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="px-4 py-1.5 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Pending{" "}
                <span className="text-primary ml-1">
                  ({statusCounts?.pending ?? 0})
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="canceled"
                className="px-4 py-1.5 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Canceled{" "}
                <span className="text-primary ml-1">
                  ({statusCounts?.cancelled ?? 0})
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search order report"
                  className="pl-9 w-60 h-10 border-[#D1D5DB]"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`h-10 w-10 border-[#D1D5DB] rounded-lg focus:ring-0 shadow-none text-gray-500 hover:text-primary transition-all ${
                      paymentStatus
                        ? "border-primary bg-primary/5 text-primary"
                        : ""
                    }`}
                    size="icon"
                  >
                    <SlidersHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => onPaymentStatusChange?.(undefined)}
                  >
                    All Payment Status
                    {!paymentStatus && <Check className="ml-auto size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onPaymentStatusChange?.("COMPLETED")}
                  >
                    Paid
                    {paymentStatus === "COMPLETED" && (
                      <Check className="ml-auto size-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onPaymentStatusChange?.("PENDING")}
                  >
                    Pending
                    {paymentStatus === "PENDING" && (
                      <Check className="ml-auto size-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onPaymentStatusChange?.("FAILED")}
                  >
                    Failed
                    {paymentStatus === "FAILED" && (
                      <Check className="ml-auto size-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onPaymentStatusChange?.("REFUNDED")}
                  >
                    Refunded
                    {paymentStatus === "REFUNDED" && (
                      <Check className="ml-auto size-4" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`h-10 w-10 border-[#D1D5DB] rounded-lg focus:ring-0 shadow-none text-gray-500 hover:text-primary transition-all ${
                      sortBy && sortBy !== "createdAt"
                        ? "border-primary bg-primary/5 text-primary"
                        : ""
                    }`}
                    size="icon"
                  >
                    <ArrowUpDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => toggleSort("createdAt")}
                    className="flex items-center justify-between"
                  >
                    Date
                    {sortBy === "createdAt" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      ))}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleSort("totalAmount")}
                    className="flex items-center justify-between"
                  >
                    Price
                    {sortBy === "totalAmount" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      ))}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleSort("orderNumber")}
                    className="flex items-center justify-between"
                  >
                    Order Number
                    {sortBy === "orderNumber" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      ))}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="h-10 w-10 border-[#D1D5DB] rounded-lg"
                size="icon"
              >
                <MoreVertical className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value={activeTab} className="m-0">
          <div className="overflow-x-auto px-6 min-h-[300px]">
            <Table className="min-w-[1000px] table-fixed">
              <TableHeader className="[&_tr]:border-0 text-table-header bg-[#EAF8E7]">
                <TableRow>
                  <TableHead className="w-[5%] py-4 rounded-l-xl px-6">
                    No.
                  </TableHead>
                  <TableHead className="w-[15%]">Order Id</TableHead>
                  {/* <TableHead className="w-[25%] ps-8">Product</TableHead> */}
                  <TableHead className="w-[15%] text-center">Date</TableHead>
                  <TableHead className="w-[10%] text-center">Price</TableHead>
                  <TableHead className="w-[12%] text-center">Payment</TableHead>
                  <TableHead className="w-[12%] text-center">Status</TableHead>
                  <TableHead className="w-[8%] rounded-r-xl text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:h-16 [&_tr]:border-b text-[#131523]">
                {isLoading ? (
                  <OrdersTableSkeleton rows={8} />
                ) : data.length === 0 ? (
                  <DataTableEmptyState colSpan={8} message="No orders found" />
                ) : (
                  data.map((order, index) => (
                    <TableRow
                      key={order.id}
                      className="h-16 hover:bg-gray-50/50"
                    >
                      <TableCell className="px-8 w-[5%] text-muted-foreground">
                        {(currentPage - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell className="px-4 font-medium w-[15%] truncate">
                        {order.orderNumber}
                      </TableCell>
                      {/* <TableCell className="w-[25%]">
                        <div className="ps-5 flex items-center gap-2">
                          {order.items && order.items.length > 0 ? (
                            <>
                              <span className="shrink-0">
                                <img
                                  src={
                                    order.items[0].productImage ||
                                    "https://via.placeholder.com/48?text=No+Img"
                                  }
                                  alt=""
                                  className="w-12 h-12 object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://via.placeholder.com/48?text=No+Img";
                                  }}
                                />
                              </span>
                              <div className="overflow-hidden">
                                <p className="font-medium line-clamp-1">
                                  {order.items[0].productName}
                                </p>
                                {order.items.length > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    + {order.items.length - 1} more items
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-muted-foreground italic">
                              No items
                            </p>
                          )}
                        </div>
                      </TableCell> */}
                      <TableCell className="text-center text-muted-foreground w-[15%]">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="px-4 font-medium text-center w-[10%]">
                        ${order.totalAmount?.toFixed(2) ?? "0.00"}
                      </TableCell>
                      <TableCell className="w-[15%]">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`size-2 rounded-full ${
                              order.paymentStatus === "COMPLETED"
                                ? "bg-[#4EA674]"
                                : order.paymentStatus === "REFUNDED"
                                ? "bg-orange-500"
                                : order.paymentStatus === "FAILED"
                                ? "bg-destructive"
                                : "bg-yellow-400"
                            }`}
                          />
                          <span>
                            {order.paymentStatus === "COMPLETED"
                              ? "Paid"
                              : order.paymentStatus === "FAILED"
                              ? "Failed"
                              : order.paymentStatus === "REFUNDED"
                              ? "Refunded"
                              : "Pending"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[12%]">
                        <div
                          className={`flex items-center justify-center gap-2 text-[13px] ${getOrderStatusColor(
                            order.fulfillmentStatus
                          )}`}
                        >
                          {getStatusIcon(order.fulfillmentStatus)}
                          <span>{formatStatus(order.fulfillmentStatus)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[8%]">
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `/dashboard/orders/${order.id}`,
                                    "_blank"
                                  )
                                }
                              >
                                <Eye className="mr-2 size-4" />
                                View Full Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex items-center justify-between ">
        <Pagination>
          <PaginationContent className="w-full flex justify-between px-4 py-4">
            <PaginationItem>
              <PaginationPrevious
                className={`${
                  currentPage === 1
                    ? "pointer-events-none opacity-50 "
                    : "cursor-pointer"
                } shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]`}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1);
                  }
                }}
              />
            </PaginationItem>
            <div className="flex items-center gap-2">
              {pages.map((page, index) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(page as number);
                      }}
                      className="cursor-pointer border-none shadow-none"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
            </div>
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    onPageChange(currentPage + 1);
                  }
                }}
                className={`${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                } shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}

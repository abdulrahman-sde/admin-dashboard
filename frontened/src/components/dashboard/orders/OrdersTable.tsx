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
import OrderDetailsDialog from "./OrderDetailsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
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
import deliveredSvg from "@/assets/icons/delivered.svg";
import pendingSvg from "@/assets/icons/pending.svg";
import shippedSvg from "@/assets/icons/shipped.svg";
import cancelledSvg from "@/assets/icons/cancelled.svg";
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
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | undefined>(
    undefined
  );
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
        return <img src={deliveredSvg} alt="delivered" className="w-5 h-5" />;
      case "PENDING":
        return <img src={pendingSvg} alt="pending" className="w-5 h-5" />;
      case "SHIPPED":
      case "PROCESSING":
        return <img src={shippedSvg} alt="shipped" className="w-5 h-5" />;
      case "CANCELED":
        return <img src={cancelledSvg} alt="cancelled" className="w-5 h-5" />;
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
          <div className="flex flex-col gap-4">
            {/* Tabs - Scrollable */}
            <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
              <TabsList className="h-auto p-1 bg-fade-green rounded-lg border-none flex-nowrap justify-start min-w-max">
                <TabsTrigger
                  value="all"
                  className="px-4 py-1.5 text-sm z-30 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all shrink-0"
                >
                  All order
                  <span className="text-primary ml-1">
                    ({statusCounts?.all ?? totalOrders})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="px-4 py-1.5 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all shrink-0"
                >
                  Completed
                  <span className="text-primary ml-1">
                    ({statusCounts?.completed ?? 0})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="px-4 py-1.5 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all shrink-0"
                >
                  Pending{" "}
                  <span className="text-primary ml-1">
                    ({statusCounts?.pending ?? 0})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="canceled"
                  className="px-4 py-1.5 text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all shrink-0"
                >
                  Canceled{" "}
                  <span className="text-primary ml-1">
                    ({statusCounts?.cancelled ?? 0})
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search and Filter Row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search order report"
                  className="pl-9 w-full h-10 border-[#D1D5DB]"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              {/* Filters - Scrollable */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-10 w-10 border-[#D1D5DB] rounded-lg focus:ring-0 shadow-none text-gray-500 hover:text-primary transition-all shrink-0 ${
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
                      className={`h-10 w-10 border-[#D1D5DB] rounded-lg focus:ring-0 shadow-none text-gray-500 hover:text-primary transition-all shrink-0 ${
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
              </div>
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
              <TableBody className="[&_tr]:h-16 [&_tr]:border-b text-[#131523] text-[15px]">
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
                                ? "bg-[#21C45D]"
                                : order.paymentStatus === "REFUNDED"
                                ? "bg-[#F59F0A]"
                                : order.paymentStatus === "FAILED"
                                ? "bg-[#EF4343]"
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
                          className={`flex items-center justify-center gap-2 text-[14px] ${getOrderStatusColor(
                            order.fulfillmentStatus
                          )}`}
                        >
                          {getStatusIcon(order.fulfillmentStatus)}
                          <span>{formatStatus(order.fulfillmentStatus)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[8%]">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsOrderDialogOpen(true);
                            }}
                          >
                            <Eye className="size-4" />
                            {/* <span>Details</span> */}
                          </Button>
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

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={isOrderDialogOpen}
        onOpenChange={(open) => setIsOrderDialogOpen(open)}
        order={selectedOrder}
      />

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

// Append dialog render inside the same file so it's available to the component
// We render it through hooks state defined in the component scope above

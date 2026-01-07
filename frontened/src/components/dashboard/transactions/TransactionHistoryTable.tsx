import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SlidersHorizontal,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Check,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransactionHistory } from "@/hooks/transactions/useTransactionHistory";
import { TransactionsTableSkeleton } from "@/components/shared/skeletons";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import { Card } from "@/components/ui/card";
import { DataTableEmptyState } from "@/components/shared/DataTableEmptyState";

export default function TransactionHistoryTable() {
  const {
    transactions,
    isFetching: isLoading,
    currentPage,
    setCurrentPage,
    pages,
    handleTabChange: onTabChange,
    activeTab,
    search,
    setSearch: onSearchChange,
    pagination,
    sortBy,
    sortOrder,
    paymentStatus,
    setPaymentStatus,
    selectedTransaction,
    modalOpen,
    setModalOpen,
    handleViewDetails,
    toggleSort,
    formatMethod,
  } = useTransactionHistory();

  return (
    <Card className="p-0 border-[#D1D5DB] bg-white">
      {/* Tabs and Controls */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <div className="p-4 pb-3 border-b border-[#D1D5DB]">
          {/* Header Content Items - Consolidated into one line */}
          <div className="flex flex-row flex-wrap items-center justify-between gap-y-4 gap-x-6">
            {/* Tabs Section - Left Side */}
            <div className="overflow-x-auto no-scrollbar max-w-full lg:max-w-max">
              <TabsList className="h-auto p-1.5 bg-[#F2FBF0] rounded-xl border-none flex-nowrap justify-start min-w-max gap-1">
                <TabsTrigger
                  value="all"
                  className="px-5 py-2 text-sm z-30 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all shrink-0 data-[state=active]:text-foreground text-muted-foreground font-medium"
                >
                  All Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="paid"
                  className="px-5 py-2 text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all shrink-0 data-[state=active]:text-foreground text-muted-foreground font-medium"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="px-5 py-2 text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all shrink-0 data-[state=active]:text-foreground text-muted-foreground font-medium"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="failed"
                  className="px-5 py-2 text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all shrink-0 data-[state=active]:text-foreground text-muted-foreground font-medium"
                >
                  Canceled
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Controls Section - Right Side */}
            <div className="flex items-center gap-3 flex-1 min-w-[300px] justify-end">
              {/* Filters Group */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-11 w-11 border-[#D1D5DB] rounded-xl transition-all shrink-0 ${
                        paymentStatus
                          ? "border-primary bg-primary/5 text-primary"
                          : "text-gray-500"
                      }`}
                      size="icon"
                    >
                      <SlidersHorizontal className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <div className="p-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Payment Status
                    </div>
                    <DropdownMenuItem
                      onClick={() => setPaymentStatus(undefined)}
                    >
                      All Statuses
                      {!paymentStatus && <Check className="ml-auto size-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPaymentStatus("COMPLETED")}
                    >
                      Paid/Completed
                      {paymentStatus === "COMPLETED" && (
                        <Check className="ml-auto size-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPaymentStatus("PENDING")}
                    >
                      Pending
                      {paymentStatus === "PENDING" && (
                        <Check className="ml-auto size-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPaymentStatus("FAILED")}
                    >
                      Failed/Canceled
                      {paymentStatus === "FAILED" && (
                        <Check className="ml-auto size-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-11 w-11 border-[#D1D5DB] rounded-xl transition-all shrink-0 ${
                        sortBy && sortBy !== "createdAt"
                          ? "border-primary bg-primary/5 text-primary"
                          : "text-gray-500"
                      }`}
                      size="icon"
                    >
                      <ArrowUpDown className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => toggleSort("amount")}
                      className="flex items-center justify-between"
                    >
                      Amount
                      {sortBy === "amount" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        ))}
                    </DropdownMenuItem>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search Bar */}
              <div className="relative w-full max-w-xs">
                <Input
                  placeholder="Search payment history"
                  className="pr-10 w-full h-11 border-none bg-[#F9F9F9] rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#9CA3AF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto min-h-[300px] px-6">
          <Table className="min-w-[1000px] table-fixed">
            <TableHeader className="[&_tr]:border-0 text-table-header bg-[#EAF8E7]">
              <TableRow>
                <TableHead className="w-[15%] rounded-l-xl px-6 py-4">
                  Customer Id
                </TableHead>
                <TableHead className="w-[20%]">Name</TableHead>
                <TableHead className="w-[15%] text-center">Date</TableHead>
                <TableHead className="w-[10%] text-center">Total</TableHead>
                <TableHead className="w-[15%] text-center">Method</TableHead>
                <TableHead className="w-[15%] text-center">Status</TableHead>
                <TableHead className="w-[10%] rounded-r-xl text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:h-16 [&_tr]:border-b text-[#131523]">
              {isLoading ? (
                <TransactionsTableSkeleton />
              ) : transactions.length === 0 ? (
                <DataTableEmptyState
                  colSpan={7}
                  message="No transactions found"
                />
              ) : (
                transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="h-16 hover:bg-gray-50/50 border-b border-[#E5E7EB]"
                  >
                    <TableCell className="px-6 font-medium truncate text-muted-foreground">
                      {transaction.customerId.toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium truncate">
                      {transaction.customer.firstName}{" "}
                      {transaction.customer.lastName}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-GB"
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {transaction.storePaymentMethod
                        ? transaction.storePaymentMethod.name
                        : formatMethod(transaction.paymentMethod)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`size-2 rounded-full ${
                            transaction.paymentStatus === "COMPLETED"
                              ? "bg-[#4EA674]"
                              : transaction.paymentStatus === "FAILED"
                              ? "bg-red-500"
                              : "bg-yellow-400"
                          }`}
                        />
                        <span
                          className={
                            transaction.paymentStatus === "COMPLETED"
                              ? "text-[#4EA674]"
                              : transaction.paymentStatus === "FAILED"
                              ? "text-red-500"
                              : "text-yellow-600"
                          }
                        >
                          {transaction.paymentStatus === "COMPLETED"
                            ? "Complete"
                            : transaction.paymentStatus === "FAILED"
                            ? "Canceled"
                            : "Pending"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleViewDetails(transaction)}
                        className="text-[#5D5FEF] hover:underline text-sm font-medium"
                      >
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <Pagination>
            <PaginationContent className="w-full flex justify-between">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination?.hasPrevPage)
                      setCurrentPage(currentPage - 1);
                  }}
                  className={
                    !pagination?.hasPrevPage
                      ? "opacity-50 pointer-events-none"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <div className="flex items-center gap-2">
                {pages.map((page, idx) => (
                  <PaginationItem key={idx}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page as number);
                        }}
                        className={`cursor-pointer ${
                          currentPage === page
                            ? "bg-[#EAF8E7] text-[#4EA674] border-[#EAF8E7]"
                            : ""
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
              </div>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination?.hasNextPage)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    !pagination?.hasNextPage
                      ? "opacity-50 pointer-events-none"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <TransactionDetailsModal
          transaction={selectedTransaction}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </Tabs>
    </Card>
  );
}

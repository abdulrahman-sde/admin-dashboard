import { Card } from "@/components/ui/card";
import { DataTableEmptyState } from "@/components/shared/DataTableEmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomersTableSkeleton } from "@/components/shared/skeletons";
import { useCustomers } from "@/hooks/customers";
import { getCustomerStatusColor } from "@/lib/utils";
import { useDeleteCustomerMutation } from "@/lib/store/services/customers/customersApi";
import { toast } from "sonner";

import { DeleteConfirmationModal } from "@/components/shared/DeleteConfirmationModal";
import { useState } from "react";

export function CustomerTable() {
  const {
    customers,
    pagination,
    isFetching,
    currentPage,
    setCurrentPage,
    pages,
    handleRowClick,
  } = useCustomers();

  const [deleteCustomer] = useDeleteCustomerMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCustomer(deleteId).unwrap();
      toast.success("Customer deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  return (
    <>
      <Card className="p-0 border-0 pb-8">
        <div className="overflow-x-auto min-h-[300px]">
          <Table className="pt-10 min-w-[1000px] table-fixed">
            <TableHeader className="h-14 border-0 text-table-header ">
              <TableRow className="bg-[#EAF8E7] hover:bg-[#EAF8E7] [&_th]:px-8 border-0">
                <TableHead className="w-[15%] rounded-l-xl">
                  Customer Id
                </TableHead>
                <TableHead className="w-[20%]">Name</TableHead>
                <TableHead className="w-[15%] text-center px-4">
                  Phone
                </TableHead>
                <TableHead className="w-[15%] text-center px-4">
                  Order Count
                </TableHead>
                <TableHead className="w-[15%] text-center px-4">
                  Total Spent
                </TableHead>
                <TableHead className="w-[10%] text-center px-8">
                  Status
                </TableHead>
                <TableHead className="w-[10%] rounded-r-xl text-right pr-8">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:h-16 [&_tr]:border-b text-[#131523] text-[14.5px]">
              {isFetching ? (
                <CustomersTableSkeleton rows={8} />
              ) : customers.length === 0 ? (
                <DataTableEmptyState colSpan={8} message="No customers found" />
              ) : (
                customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="h-16 cursor-pointer hover:bg-gray-50/50"
                  >
                    <TableCell
                      className="w-[15%] px-8 truncate text-muted-foreground"
                      onClick={() => handleRowClick(customer.id)}
                    >
                      {customer.id}
                    </TableCell>
                    <TableCell
                      className="w-[20%] px-8 truncate font-medium"
                      onClick={() => handleRowClick(customer.id)}
                    >
                      {customer.firstName} {customer.lastName}
                    </TableCell>

                    <TableCell className="w-[15%] text-center px-8">
                      {customer.phone}
                    </TableCell>
                    <TableCell className="w-[15%] text-center px-8">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell className="w-[15%] text-center px-8 font-medium">
                      {customer.totalSpent.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      className={
                        "w-[10%] " +
                        getCustomerStatusColor(customer.status) +
                        " text-[13px]"
                      }
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <div
                          className={`size-2 rounded-full ${
                            customer.status === "ACTIVE"
                              ? "bg-rise"
                              : customer.status === "INACTIVE"
                              ? "bg-destructive"
                              : "bg-warning"
                          }`}
                        />
                        {customer.status.charAt(0) +
                          customer.status.slice(1).toLowerCase()}
                      </div>
                    </TableCell>
                    <TableCell className="w-[10%] text-right pr-4">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDeleteClick(e, customer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - scrollable on very small screens */}
        <div className="flex items-center justify-between mt-4 overflow-x-auto no-scrollbar max-w-full px-4">
          <Pagination className="w-full">
            <PaginationContent className="w-full flex justify-between gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious
                  className={`${
                    !pagination?.hasPrevPage
                      ? "pointer-events-none opacity-50 "
                      : "cursor-pointer"
                  } shadow-sm border border-neutral-200 h-9 px-3`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>

              <div className="hidden sm:flex items-center gap-1">
                {pages.map((page, idx) => (
                  <PaginationItem key={idx}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page as number)}
                        className="cursor-pointer border-none shadow-none h-9 w-9 flex items-center justify-center font-bold"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
              </div>

              {/* Mobile Page Indicator */}
              <div className="flex sm:hidden items-center px-2 text-sm font-medium">
                Page {currentPage} of {pages[pages.length - 1] || 1}
              </div>

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`
                    ${
                      !pagination?.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    shadow-sm border border-neutral-200 h-9 px-3
                  `}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
      <DeleteConfirmationModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </>
  );
}

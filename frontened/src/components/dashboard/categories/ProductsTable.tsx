import { Button } from "@/components/ui/button";
import { DataTableEmptyState } from "@/components/shared/DataTableEmptyState";
import { useNavigate } from "react-router";
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
import { Search, SlidersHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductsTableSkeleton } from "@/components/shared/skeletons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProducts } from "@/hooks/products/useProducts";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { ProductsQueryParams } from "@/types/products.types";
import { DeleteConfirmationModal } from "@/components/shared/DeleteConfirmationModal";

import { useProductDelete } from "@/hooks/products/useProductDelete";

export default function ProductsTable() {
  const navigate = useNavigate();
  const {
    products,
    pagination,
    meta,
    isFetching,
    currentPage,
    pages,
    tabs,
    activeTab,
    setActiveTab,
    setCurrentPage,
    setSortBy,
    setSortOrder,
    sortBy,
    sortOrder,
    search,
    setSearch,
    selectedIds,
    handleCheckboxChange,
    handleSelectAll,
    resetSelection,
  } = useProducts();

  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleBulkDelete,
    isDeleting,
  } = useProductDelete(selectedIds, resetSelection);

  const handleSort = (field: NonNullable<ProductsQueryParams["sortBy"]>) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 bg-white py-7 px-5 shadow-sm rounded-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Scrollable Tabs */}
        <div className="overflow-x-auto -mx-2 px-2 pb-1 lg:pb-0">
          <div className="flex items-center gap-1 bg-fade-green rounded-lg p-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span
                  className={`${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  } ml-1`}
                >
                  ({meta?.[tab.id as keyof typeof meta]})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {selectedIds.length > 0 ? (
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex-1 lg:flex-none bg-destructive hover:bg-destructive/80"
            >
              Delete ({selectedIds.length})
            </Button>
          ) : (
            <>
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search your product"
                  className="pl-9 w-full lg:w-60 border-neutral-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={`border-neutral-300 h-10 w-10 ${
                        sortBy && sortBy !== "createdAt"
                          ? "text-primary border-primary bg-primary/5"
                          : ""
                      }`}
                      variant="outline"
                      size="icon"
                    >
                      <SlidersHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 border-[#E5E7EB] shadow-xl"
                  >
                    <DropdownMenuItem
                      onClick={() => handleSort("createdAt")}
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
                      onClick={() => handleSort("price")}
                      className="flex items-center justify-between"
                    >
                      Price
                      {sortBy === "price" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        ))}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort("totalSales")}
                      className="flex items-center justify-between"
                    >
                      Sales
                      {sortBy === "totalSales" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        ))}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort("stockQuantity")}
                      className="flex items-center justify-between"
                    >
                      Stock
                      {sortBy === "stockQuantity" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        ))}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="icon"
                  className="bg-[#4EA674] hover:bg-[#3d8a5e] h-10 w-10"
                  onClick={() => navigate("/dashboard/products/add")}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <Table className="min-w-[1000px] table-fixed">
          <TableHeader className="[&_tr]:border-0 bg-[#EAF8E7] text-table-header ">
            <TableRow className="[&_th]:py-4">
              <TableHead className="w-[5%] rounded-l-xl ps-8">
                <Checkbox
                  className="w-4.5 h-4.5 bg-white"
                  checked={
                    products.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onCheckedChange={() =>
                    handleSelectAll(products.map((p) => p.id))
                  }
                />
              </TableHead>
              <TableHead className="w-[5%]">No.</TableHead>
              <TableHead className="w-[30%] text-center">Product</TableHead>
              <TableHead className="w-[20%] text-center">Created At</TableHead>
              <TableHead className="w-[20%] text-center">Order</TableHead>
              <TableHead className="w-[20%] text-right rounded-r-xl px-4 pr-8">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:h-16 [&_tr]:border-b text-[15px] text-[#000000]">
            {isFetching ? (
              <ProductsTableSkeleton />
            ) : products.length === 0 ? (
              <DataTableEmptyState colSpan={6} message="No products found" />
            ) : (
              <>
                {products.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell className="ps-8 w-[5%]">
                      <Checkbox
                        className="w-4.5 h-4.5 bg-white"
                        checked={selectedIds.includes(product.id)}
                        onCheckedChange={() => handleCheckboxChange(product.id)}
                      />
                    </TableCell>
                    <TableCell className="w-[5%]">
                      {(currentPage - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell className="w-[30%]">
                      <div className="flex items-center gap-3 justify-center lg:justify-start lg:ps-10">
                        <div className="size-10 flex items-center justify-center rounded-lg bg-gray-50 overflow-hidden shrink-0">
                          <img
                            src={
                              product.images?.[0] ||
                              "https://via.placeholder.com/40?text=No+Image"
                            }
                            alt={product.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/40?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="text-left overflow-hidden">
                          <div className=" line-clamp-1">{product.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {product.category.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center w-[20%]">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center w-[20%] truncate">
                      {product.totalSales || 0}
                    </TableCell>
                    <TableCell className="w-[20%]">
                      <div className="flex items-center justify-end px-4">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/products/edit/${product.id}`)
                          }
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                        >
                          <Edit className="size-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded transition-colors">
                          <Trash2 className="size-4 text-muted-foreground" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent className="w-full flex justify-between px-4">
          <PaginationItem>
            <PaginationPrevious
              className={`${
                !pagination?.hasPrevPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
                shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]`}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
          </PaginationItem>
          <div className="flex items-center gap-2">
            {pages.map((page: string | number, idx: number) => (
              <PaginationItem key={idx}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page as number)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </div>
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`${
                !pagination?.hasNextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
                shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleBulkDelete}
        title="Delete Products"
        description={`Are you sure you want to delete ${selectedIds.length} products? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}

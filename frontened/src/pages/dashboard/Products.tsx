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
import {
  Search,
  Save,
  Plus,
  AlertCircle,
  Star,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { ProductsTableSkeleton } from "@/components/shared/skeletons";
import { useProducts } from "@/hooks/products/useProducts";
import { DeleteConfirmationModal } from "@/components/shared/DeleteConfirmationModal";

import { useProductDelete } from "@/hooks/products/useProductDelete";

export default function Products() {
  const navigate = useNavigate();

  const {
    products,
    pagination,
    isFetching,
    isError,
    currentPage,
    pages,
    setCurrentPage,
    selectedIds,
    handleCheckboxChange,
    handleSelectAll,
    resetSelection,
    search,
    setSearch,
  } = useProducts();

  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleBulkDelete,
    isDeleting,
  } = useProductDelete(selectedIds, resetSelection);

  return (
    <div className="space-y-6 px-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#111827]">Product List</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {selectedIds.length > 0 ? (
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="shrink-0 sm:flex-none"
            >
              Delete ({selectedIds.length})
            </Button>
          ) : (
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <Input
                placeholder="Search products"
                className="pl-10 w-full sm:w-64 border-[#E5E7EB] text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          <Button
            className="bg-[#4EA674] hover:bg-[#3d8a5e] text-white"
            onClick={() => navigate("/dashboard/products/add")}
            disabled={selectedIds.length > 0}
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Product</span>
          </Button>
          {/* <Button
            variant="outline"
            disabled={true}
            className="border-[#E5E7EB] hidden md:flex "
          >
            <Save className="h-4 w-4 mr-2" />
            Save to draft
          </Button> */}
        </div>
      </div>

      {/* Table - Scrollable */}
      <div className="bg-white rounded-lg overflow-x-auto no-scrollbar min-h-[300px] border border-[#E5E7EB]">
        <Table className="min-w-[800px]">
          <TableHeader className=" bg-white ">
            <TableRow className="[&_th]:pt-8 [&_th]:pb-3 text-[14px] [&_th]:text-muted-foreground">
              <TableHead className="w-12 ps-8">
                <Checkbox
                  className="w-4.5 h-4.5 bg-white mr-2"
                  checked={
                    products.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onCheckedChange={() =>
                    handleSelectAll(products.map((p) => p.id))
                  }
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead className="">Color</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[14px]  ">
            {isFetching ? (
              <ProductsTableSkeleton rows={10} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-red-500 gap-2">
                    <AlertCircle className="h-8 w-8" />
                    <p className="font-medium">Failed to load products</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-20 text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-b inter-regular border-[#E5E7EB] hover:bg-[#F9FAFB] [&_td]:py-3 [&_td]:text-table-text-color [&_td]:inter-regular"
                >
                  <TableCell className="ps-8">
                    <Checkbox
                      className="w-4.5 h-4.5 bg-white mr-2"
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={() => handleCheckboxChange(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-[#111827]">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[#111827]">
                        {product.isUnlimitedStock
                          ? "Unlimited Stock"
                          : product.stockQuantity}
                      </span>
                      {product.stockQuantity < 10 &&
                        !product.isUnlimitedStock && (
                          <span className="text-xs text-red-500 font-medium">
                            Low Stock
                          </span>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {product.colors && product.colors.length > 0 ? (
                        product.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[#111827]">
                      ${product.price.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {/* <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> */}
                      <span className="font-medium text-[#111827]">
                        {product.averageRating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-muted-foreground">
                        ({product.ratingCount || 0} Votes)
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Scrollable on very small screens */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full pb-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5 min-w-max">
            {pages.map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === "number" && setCurrentPage(p)}
                className={`w-8 h-8 rounded-md text-[13px] font-bold transition-all shrink-0 ${
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
            className="p-1.5 text-gray-400 hover:text-gray-900 disabled:hover:text-gray-400 disabled:opacity-30 transition-colors shrink-0"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="text-[13px] text-[#7E84A3] font-bold shrink-0">
          {pagination?.total || 0} Results
        </div>
      </div>

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

import { useState } from "react";
import { toast } from "sonner";
import { useBulkDeleteProductsMutation } from "@/lib/store/services/products/productsApi";

export const useProductDelete = (
  selectedIds: string[],
  resetSelection: () => void
) => {
  const [bulkDeleteProducts, { isLoading: isDeleting }] =
    useBulkDeleteProductsMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteProducts(selectedIds).unwrap();
      toast.success("Products deleted successfully");
      resetSelection();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete products:", error);
      toast.error("Failed to delete products");
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleBulkDelete,
    isDeleting,
  };
};

import { useState } from "react";
import { toast } from "sonner";
import {
  useBulkDeleteProductsMutation,
  useDeleteProductMutation,
} from "@/lib/store/services/products/productsApi";

export const useProductDelete = (
  selectedIds: string[],
  resetSelection: () => void
) => {
  const [bulkDeleteProducts, { isLoading: isBulkDeleting }] =
    useBulkDeleteProductsMutation();
  const [deleteProduct, { isLoading: isSingleDeleting }] =
    useDeleteProductMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    try {
      if (singleDeleteId) {
        await deleteProduct(singleDeleteId).unwrap();
        setSingleDeleteId(null);
      } else {
        await bulkDeleteProducts(selectedIds).unwrap();
        resetSelection();
      }
      toast.success("Deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openBulkDelete = () => {
    setSingleDeleteId(null);
    setIsDeleteModalOpen(true);
  };

  const openSingleDelete = (id: string) => {
    setSingleDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleConfirmDelete,
    isDeleting: isBulkDeleting || isSingleDeleting,
    openBulkDelete,
    openSingleDelete,
    singleDeleteId,
  };
};

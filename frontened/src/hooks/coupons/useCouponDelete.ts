import { useState } from "react";
import { toast } from "sonner";
import { couponsApi } from "@/lib/store/services/coupons/couponsApi";

export const useCouponDelete = (
  selectedIds: string[],
  resetSelection: () => void
) => {

  const [deleteCoupon] = couponsApi.useDeleteCouponMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteCoupon(id).unwrap()));
      toast.success("Coupons deleted successfully");
      resetSelection();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete coupons:", error);
      toast.error("Failed to delete some coupons");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleBulkDelete,
    isDeleting,
  };
};

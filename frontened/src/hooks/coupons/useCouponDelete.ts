import { useState } from "react";
import { toast } from "sonner";
import { couponsApi } from "@/lib/store/services/coupons/couponsApi";

export const useCouponDelete = (
  selectedIds: string[],
  resetSelection: () => void
) => {
  // Use the mutation from the API. Note: ensure useDeleteCouponMutation is exported/available.
  // Based on checking the file previously, it might be named useDeleteCouponMutation or need to be accessed via couponsApi.useDeleteCouponMutation.
  // Just in case, I'll use the one from api slice if exported, or the property on the default export.
  // But wait, in the component it was `couponsApi.useDeleteCouponMutation()`.

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

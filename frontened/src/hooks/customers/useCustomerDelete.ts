import { useState } from "react";
import { toast } from "sonner";
import { useDeleteCustomerMutation } from "@/lib/store/services/customers/customersApi";
import { useNavigate } from "react-router";

export const useCustomerDelete = (customerId?: string) => {
  const navigate = useNavigate();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id?: string | React.MouseEvent | unknown) => {
    const targetId = typeof id === "string" ? id : customerId;

    if (!targetId) {
      toast.error("Cannot delete: Invalid customer ID");
      return;
    }

    try {
      await deleteCustomer(targetId).unwrap();
      toast.success("Customer deleted successfully");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      if (customerId) {
        navigate("/dashboard/customers");
      }
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDelete,
    isDeleting,
    deleteId,
    setDeleteId,
    handleDeleteClick,
  };
};

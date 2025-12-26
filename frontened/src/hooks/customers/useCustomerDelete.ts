import { useState } from "react";
import { toast } from "sonner";
import { useDeleteCustomerMutation } from "@/lib/store/services/customers/customersApi";
import { useNavigate } from "react-router";

export const useCustomerDelete = (customerId?: string) => {
  const navigate = useNavigate();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async (id?: string | React.MouseEvent | unknown) => {
    const targetId = typeof id === "string" ? id : customerId;

    if (!targetId) {
      console.error("Delete attempt failed: No targetId found", {
        id,
        customerId,
      });
      toast.error("Cannot delete: Invalid customer ID");
      return;
    }

    // Safety check for object stringification
    if (targetId.toString() === "[object Object]") {
      console.error("Delete attempt blocked: ID is [object Object]", {
        id,
        customerId,
      });
      toast.error("Cannot delete: Invalid ID format");
      return;
    }
    try {
      await deleteCustomer(targetId).unwrap();
      toast.success("Customer deleted successfully");
      if (customerId) {
        navigate("/dashboard/customers");
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("Failed to delete customer");
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDelete,
    isDeleting,
  };
};

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateCustomerMutation } from "@/lib/store/services/customers/customersApi";
import type { Customer, CustomerDetail } from "@/types/customers.types";
import { type CustomerFormValues } from "@/schemas/customer.schema";

interface UseCustomerEditProps {
  customer: Customer | CustomerDetail;
  onOpenChange: (open: boolean) => void;
}

export const useCustomerEdit = ({
  customer,
  onOpenChange,
}: UseCustomerEditProps) => {
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

  const form = useForm<CustomerFormValues>({
    defaultValues: {
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      role: (customer as any).role || "CUSTOMER",
      isGuest: (customer as any).isGuest || false,
      notes: (customer as CustomerDetail).notes || "",
      status: (customer as any).status || "ACTIVE",
    },
  });

  // Reset form when customer changes
  useEffect(() => {
    if (customer) {
      form.reset({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        role: (customer as any).role || "CUSTOMER",
        isGuest: (customer as any).isGuest || false,
        notes: (customer as CustomerDetail).notes || "",
        status: (customer as any).status || "ACTIVE",
      });
    }
  }, [customer, form]);

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      await updateCustomer({
        id: customer.id,
        body: values,
      }).unwrap();
      toast.success("Customer updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Failed to update customer");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit) as (
      e?: React.BaseSyntheticEvent
    ) => Promise<void>,
    isLoading,
  };
};

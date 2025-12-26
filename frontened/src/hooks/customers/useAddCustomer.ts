import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  customerSchema,
  type CustomerFormValues,
} from "@/schemas/customer.schema";
import { useAddCustomerMutation } from "@/lib/store/services/customers/customersApi";

export const useAddCustomer = () => {
  const navigate = useNavigate();
  const [addCustomer, { isLoading }] = useAddCustomerMutation();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "CUSTOMER",
      isGuest: false,
      notes: "",
      tags: [],
      address: {
        street: "",
        address2: "",
        city: "",
        country: "",
        postalCode: "",
        state: "",
        phone: "",
      },
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await addCustomer(data).unwrap();
      toast.success("Customer created successfully");
      navigate("/dashboard/customers");
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/customers");
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancel,
    isLoading,
  };
};

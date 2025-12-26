import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCouponMutation } from "@/lib/store/services/coupons/couponsApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { CouponType, AppliesTo } from "@/types/coupons.types";
import { addCouponSchema, type AddCouponFormValues } from "@/schemas";

export const useAddCoupon = () => {
  const navigate = useNavigate();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const form = useForm<AddCouponFormValues>({
    resolver: zodResolver(addCouponSchema),
    defaultValues: {
      code: "",
      name: "",
      type: "FIXED",
      value: 0,
      startDate: new Date(),
      endDate: null,
      usageLimit: null,
      appliesTo: "ALL",
      noEndDate: false,
      noUsageLimit: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payload = {
        code: data.code,
        name: data.name,
        type: data.type as CouponType,
        value: data.value,
        startDate: data.startDate.toISOString(),
        endDate: data.noEndDate ? null : data.endDate?.toISOString() || null,
        usageLimit: data.noUsageLimit ? null : data.usageLimit || null,
        appliesTo: data.appliesTo as AppliesTo,
      };

      await createCoupon(payload).unwrap();
      toast.success("Coupon created successfully!");
      navigate("/dashboard/coupons");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create coupon");
    }
  });

  return {
    form,
    onSubmit,
    isLoading,
  };
};

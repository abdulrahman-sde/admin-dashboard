import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCouponMutation } from "@/lib/store/services/coupons/couponsApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { CouponType } from "@/types/coupons.types";
import { addCouponSchema, type AddCouponFormValues } from "@/schemas";
import { addDays } from "date-fns";

export const useAddCoupon = () => {
  const navigate = useNavigate();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const form = useForm<AddCouponFormValues>({
    resolver: zodResolver(addCouponSchema),
    // leave `value` unset so the form shows an empty field (use placeholder in UI)
    // cast to any because AddCouponFormValues requires some fields — initial empties are intentional
    defaultValues: {
      code: "",
      name: "",
      type: "FIXED",
      value: undefined as unknown as number,
      startDate: new Date(),
      endDate: null,
      durationDays: null,
      usageLimit: null,
      noEndDate: false,
      noUsageLimit: false,
    } as any,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let computedEndDate: Date | undefined | null = undefined;
      if (data.noEndDate) {
        computedEndDate = undefined;
      } else if (data.durationDays != null) {
        computedEndDate = addDays(data.startDate, data.durationDays);
      } else {
        computedEndDate = data.endDate || undefined;
      }

      const payload = {
        code: data.code,
        name: data.name,
        type: data.type as CouponType,
        value: data.value,
        startDate: data.startDate,
        noEndDate: data.noEndDate,
        noUsageLimit: data.noUsageLimit,
        endDate: computedEndDate,
        usageLimit: data.noUsageLimit
          ? undefined
          : data.usageLimit ?? undefined,
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

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePaymentMethodMutation } from "@/lib/store/services/payment-methods/paymentMethodsApi";
import { toast } from "sonner";

const paymentMethodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum([
    "CREDIT_CARD",
    "DEBIT_CARD",
    "PAYPAL",
    "BANK_TRANSFER",
    "CASH_ON_DELIVERY",
  ]),
  last4: z.string().length(4, "Must be exactly 4 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid format (MM/YY)"),
  holderName: z.string().min(1, "Holder name is required"),
});

interface AddPaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentMethodModal({
  open,
  onOpenChange,
}: AddPaymentMethodModalProps) {
  const [createMethod, { isLoading }] = useCreatePaymentMethodMutation();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: "",
      type: "CREDIT_CARD",
      last4: "",
      expiryDate: "",
      holderName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof paymentMethodSchema>) {
    try {
      await createMethod({
        ...values,
        isDefault: true,
        status: "ACTIVE",
      }).unwrap();
      toast.success("Payment method added successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add payment method");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Method Name (Nickname)</FormLabel>
                  <FormControl>
                    <Input placeholder="Personal Visa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                      <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="last4"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Last 4 Digits</FormLabel>
                    <FormControl>
                      <Input placeholder="4242" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Expiry (MM/YY)</FormLabel>
                    <FormControl>
                      <Input placeholder="12/26" maxLength={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="holderName"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Card Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-[#4EA674] hover:bg-[#3d8a5e]"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Method"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

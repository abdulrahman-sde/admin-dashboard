import { z } from "zod";
import { enumField } from "./helpers.js";

const PaymentMethodEnum = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "PAYPAL",
  "BANK_TRANSFER",
  "CASH_ON_DELIVERY",
] as const;

export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: enumField(PaymentMethodEnum, "Payment Method Type"),
  provider: z.string().optional(),
  last4: z.string().length(4, "Must be exactly 4 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid format (MM/YY)")
    .optional(),
  holderName: z.string().min(1, "Holder name is required"),
  isDefault: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

export type CreatePaymentMethodInput = z.infer<
  typeof createPaymentMethodSchema
>;
export type UpdatePaymentMethodInput = z.infer<
  typeof updatePaymentMethodSchema
>;

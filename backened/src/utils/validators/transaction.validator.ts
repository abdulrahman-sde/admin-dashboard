import { z } from "zod";
import { paginationSchema, enumField } from "./helpers.js";

export const getTransactionsQuerySchema = paginationSchema.extend({
  search: z.string().optional(), // transactionNumber or orderNumber or customer
  storePaymentMethodId: z.string().optional(), // Filter by store payment method ID
  paymentStatus: enumField(
    ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
    "Payment Status"
  ).optional(),

  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),

  sortBy: enumField(["createdAt", "amount"], "Sort By").default("createdAt"),
  sortOrder: enumField(["asc", "desc"], "Sort Order").default("desc"),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;

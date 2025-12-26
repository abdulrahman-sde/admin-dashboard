import { z } from "zod";
import { paginationSchema, enumField } from "./helpers.js";

const objectIdRule = (val: string) => /^[0-9a-fA-F]{24}$/.test(val);

export const customerInputSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone number is required"),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(), // Optional in Prisma
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().optional(),
  apartment: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// Make address strict to reject unknown keys (keeps downstream simple)
export const strictAddressSchema = addressSchema.strict();

export const orderItemInputSchema = z.object({
  productId: z.string().refine(objectIdRule, { message: "Invalid productId" }),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  // Do NOT accept prices, names, or images from client. Server fetches source of truth.
});

export const paymentMethodSchema = enumField(
  ["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "BANK_TRANSFER", "CASH_ON_DELIVERY"],
  "Payment Method"
);

export const createOrderInputSchema = z.object({
  customerId: z
    .string()
    .optional()
    .refine((v) => !v || objectIdRule(v), {
      message: "Invalid customerId",
    }),
  customer: customerInputSchema.optional(),
  sessionId: z.string().optional(),

  items: z.array(orderItemInputSchema).min(1, "At least one item is required"),

  shippingAddress: strictAddressSchema,
  billingAddress: strictAddressSchema.optional(),

  paymentMethod: paymentMethodSchema,

  shippingFee: z.number().nonnegative().optional(),
  taxAmount: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  couponCode: z.string().optional(),

  notes: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  country: z.string().optional(),
});

export const parseCreateOrderInput = (input: unknown) =>
  createOrderInputSchema.parse(input);

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const getOrdersQuerySchema = paginationSchema.extend({
  search: z.string().optional(), // Search by Order Number or Customer Name/Email

  // Status Filters
  fulfillmentStatus: enumField(
    ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"],
    "Fulfillment Status"
  ).optional(),

  paymentStatus: enumField(
    ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
    "Payment Status"
  ).optional(),

  // Date Range
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),

  // User Scope
  customerId: z.string().optional(),

  // Sorting
  sortBy: enumField(
    ["createdAt", "totalAmount", "orderNumber"],
    "Sort By"
  ).default("createdAt"),
  sortOrder: enumField(["asc", "desc"], "Sort Order").default("desc"),
});

export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;

export const updateOrderSchema = z.object({
  fulfillmentStatus: enumField(
    [
      "PENDING",
      "PROCESSING",
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "RETURNED",
      "CANCELED",
    ],
    "Fulfillment Status"
  ).optional(),
  paymentStatus: enumField(
    ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
    "Payment Status"
  ).optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

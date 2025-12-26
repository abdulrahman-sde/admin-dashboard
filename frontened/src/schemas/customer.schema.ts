import { z } from "zod";

// ============================================
// Shared Sub-Schemas
// ============================================

const addressSchema = z.object({
  street: z.string().min(1, "Street Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal Code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
});

// ============================================
// Query Validator (GET /customers)
// ============================================

export const getCustomersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "VIP"]).optional(),
  sortBy: z
    .enum(["createdAt", "totalSpent", "totalOrders", "firstName"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetCustomersQuery = z.infer<typeof getCustomersQuerySchema>;

// ============================================
// Create Validator (POST /customers)
// ============================================

export const customerSchema = z.object({
  firstName: z
    .string({ required_error: "First Name is required" })
    .min(1, "First Name is required"),
  lastName: z
    .string({ required_error: "Last Name is required" })
    .min(1, "Last Name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  phone: z.string().optional(),

  // Role & Status
  role: z.enum(["GUEST", "CUSTOMER", "VIP"], {
    required_error: "Role is required",
  }),
  isGuest: z.boolean(),

  // Metadata
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),

  // Nested Address
  address: addressSchema.optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "VIP", "BLOCKED"]).default("ACTIVE"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

// ============================================
// Update Validator (PUT /customers/:id)
// ============================================

export const updateCustomerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "VIP"]).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isGuest: z.boolean().optional(),
  address: addressSchema.partial().optional(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

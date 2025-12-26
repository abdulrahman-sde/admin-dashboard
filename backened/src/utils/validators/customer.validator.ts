import { z } from "zod";
import { paginationSchema, enumField } from "./helpers.js";

// ============================================
// Query Validator (GET /customers)
// ============================================

export const getCustomersQuerySchema = paginationSchema.extend({
  search: z.string().optional(), // Search by Name, Email, Phone

  // Filters
  status: enumField(["ACTIVE", "INACTIVE", "VIP"], "Status").optional(),

  // Sorting
  sortBy: enumField(
    ["createdAt", "totalSpent", "totalOrders", "firstName"],
    "Sort By"
  ).default("createdAt"),
  sortOrder: enumField(["asc", "desc"], "Sort Order").default("desc"),
});

export type GetCustomersQuery = z.infer<typeof getCustomersQuerySchema>;

// ============================================
// Create Validator (POST /customers)
// ============================================

const addressSchema = z.object({
  street: z.string().min(1, "Street Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal Code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  apartment: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const createCustomerSchema = z.object({
  firstName: z
    .string({ message: "First Name is required" })
    .min(1, "First Name is required"),
  role: z
    .enum(["GUEST", "CUSTOMER"], { message: "Role is required" })
    .default("GUEST"),
  isGuest: z.boolean().default(true),
  lastName: z
    .string({ message: "Last Name is required" })
    .min(1, "Last Name is required"),
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  phone: z.string().optional(),
  notes: z.string().optional(),
  address: addressSchema.optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

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

  // Address updates could go here too, but usually handled separately or embedded
  isGuest: z.boolean().optional(),
  address: addressSchema.partial().optional(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

// ============================================
// Params Validator (Delete/Get /customers/:id)
// ============================================

export const customerParamsSchema = z.object({
  id: z
    .string({
      message: "Customer ID is required",
    })
    .min(1, "Customer ID cannot be empty"),
});

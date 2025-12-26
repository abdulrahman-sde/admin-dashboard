import { z } from "zod";

// Register Schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]).optional(),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

// Customer Auth Schemas
export const registerCustomerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

export const loginCustomerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ============================================
// Zod-Inferred Types (Single Source of Truth)
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type LoginCustomerInput = z.infer<typeof loginCustomerSchema>;

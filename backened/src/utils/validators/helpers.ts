import { z } from "zod";

/**
 * Better number coercion that provides clear error messages
 * Handles empty strings, undefined, and invalid numbers properly
 */
export const numericString = (fieldName: string = "field") => {
  return z.preprocess(
    (val) => {
      // If undefined or empty string, return undefined (will use default if set)
      if (val === undefined || val === null || val === "") {
        return undefined;
      }

      // Try to convert to number
      const num = Number(val);

      // Return undefined if NaN (will trigger error message)
      return isNaN(num) ? undefined : num;
    },
    z.number({
      message: `${fieldName} must be a valid number`,
    })
  );
};

/**
 * Optional numeric string with default value
 */
export const optionalNumericString = (
  fieldName: string = "field",
  defaultValue?: number
) => {
  return z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") {
        return defaultValue;
      }
      const num = Number(val);
      return isNaN(num) ? defaultValue : num;
    },
    z.number({
      message: `${fieldName} must be a valid number`,
    })
  );
};

/**
 * Safe number field with automatic string coercion
 * Use for form fields that come as strings but should be numbers
 */
export const safeNumber = (fieldName: string = "field") => {
  return z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") {
        return undefined;
      }
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({
      message: `${fieldName} must be a valid number`,
    })
  );
};

/**
 * Pagination helper - always returns valid page/limit with defaults
 */
export const paginationSchema = z.object({
  page: optionalNumericString("page", 1).pipe(
    z.number().int().min(1, "Page must be at least 1")
  ),
  limit: optionalNumericString("limit", 10).pipe(
    z
      .number()
      .int()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
  ),
});

/**
 * Custom error message for enum fields
 */
export const enumField = <T extends readonly [string, ...string[]]>(
  values: T,
  fieldName: string = "field"
) => {
  return z.enum(values, {
    message: `${fieldName} must be one of: ${values.join(", ")}`,
  });
};

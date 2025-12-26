import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Transform Prisma errors into user-friendly messages
 */
const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
  const errorMap: Record<
    string,
    { status: number; getMessage: (err: any) => string }
  > = {
    // Unique constraint violation
    P2002: {
      status: 409,
      getMessage: (err) => {
        const field = (err.meta?.target as string[])?.[0] || "field";
        return `A record with this ${field} already exists`;
      },
    },
    // Record not found
    P2025: {
      status: 404,
      getMessage: () => "Record not found",
    },
    // Foreign key constraint failed
    P2003: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.field_name || "related record";
        return `Invalid ${field} - the referenced record does not exist`;
      },
    },
    // Required field missing
    P2012: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.field || "field";
        return `Missing required field: ${field}`;
      },
    },
    // Invalid ID format
    P2023: {
      status: 400,
      getMessage: () => "Invalid ID format",
    },
    // Inconsistent column data
    P2024: {
      status: 400,
      getMessage: () => "Invalid data format",
    },
    // Dependent records exist (can't delete)
    P2014: {
      status: 400,
      getMessage: () => "Cannot delete - related records exist",
    },
    // Query interpretation error
    P2009: {
      status: 400,
      getMessage: () => "Invalid query parameters",
    },
    // Raw query failed
    P2010: {
      status: 400,
      getMessage: () => "Query execution failed",
    },
    // Null constraint violation
    P2011: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.constraint || "field";
        return `${field} cannot be null`;
      },
    },
    // Value too long
    P2000: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.column_name || "field";
        return `Value for ${field} is too long`;
      },
    },
    // Value out of range
    P2006: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.column_name || "field";
        return `Invalid value for ${field}`;
      },
    },
  };

  const handler = errorMap[err.code];
  if (handler) {
    return {
      status: handler.status,
      message: handler.getMessage(err),
    };
  }

  // Unknown Prisma error
  return {
    status: 500,
    message: "A database error occurred",
  };
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.error("Error Details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("Error:", err.message);
  }

  // Check if it's our custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const fieldErrors = err.flatten().fieldErrors;
    const errorMessages = Object.values(fieldErrors).flat();
    const firstError = errorMessages[0] || "Validation failed";

    res.status(400).json({
      success: false,
      message: firstError,
      errors: fieldErrors,
    });
    return;
  }

  // Handle Prisma Known Errors (simplified)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { status, message } = handlePrismaError(err);
    res.status(status).json({
      success: false,
      message,
    });
    return;
  }

  // Handle Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid data provided to database",
    });
    return;
  }

  // Handle Prisma Initialization Errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({
      success: false,
      message: "Database connection error",
    });
    return;
  }

  // Handle JSON Syntax Errors
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
    return;
  }

  // All other errors = 500 Internal Server Error
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred",
  });
};

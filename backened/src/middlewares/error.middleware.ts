import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
  const errorMap: Record<
    string,
    {
      status: number;
      getMessage: (err: Prisma.PrismaClientKnownRequestError) => string;
    }
  > = {
    P2002: {
      status: 409,
      getMessage: (err) => {
        const field = (err.meta?.target as string[])?.[0] || "field";
        return `A record with this ${field} already exists`;
      },
    },
    P2025: {
      status: 404,
      getMessage: () => "Record not found",
    },
    P2003: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.field_name || "related record";
        return `Invalid ${field} - the referenced record does not exist`;
      },
    },
    P2012: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.field || "field";
        return `Missing required field: ${field}`;
      },
    },
    P2023: {
      status: 400,
      getMessage: () => "Invalid ID format",
    },
    P2024: {
      status: 400,
      getMessage: () => "Invalid data format",
    },
    P2014: {
      status: 400,
      getMessage: () => "Cannot delete - related records exist",
    },
    P2009: {
      status: 400,
      getMessage: () => "Invalid query parameters",
    },
    P2010: {
      status: 400,
      getMessage: () => "Query execution failed",
    },
    P2011: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.constraint || "field";
        return `${field} cannot be null`;
      },
    },
    P2000: {
      status: 400,
      getMessage: (err) => {
        const field = err.meta?.column_name || "field";
        return `Value for ${field} is too long`;
      },
    },
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
  if (process.env.NODE_ENV === "development") {
    const isExpectedError = err instanceof AppError || err instanceof ZodError;
    const isUnauthorized = err instanceof AppError && err.statusCode === 401;

    if (isUnauthorized) {
    } else if (!isExpectedError) {
      console.error("💥 Unexpected Error:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
    }
  } else if (!(err instanceof AppError && err.statusCode === 401)) {
    console.error("💥 Error:", err.message);
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { status, message } = handlePrismaError(err);
    res.status(status).json({
      success: false,
      message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid data provided to database",
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({
      success: false,
      message: "Database connection error",
    });
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred",
  });
};

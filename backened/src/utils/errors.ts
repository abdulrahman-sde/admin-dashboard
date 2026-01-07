export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}
export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Already exists") {
    super(409, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", public details?: unknown) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too many requests, please try again later") {
    super(429, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(500, message, false); // isOperational = false (unexpected error)
  }
}

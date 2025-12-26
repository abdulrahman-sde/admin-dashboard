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
// Use when client-side input fails validation (e.g., missing required fields, invalid format).
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}
// Use when the request requires authentication but the user is not logged in or provided invalid credentials.
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}
// Use when the requested resource does not exist.
export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(404, message);
  }
}

// Use when a request conflicts with the current state of the server (e.g., trying to create a resource that already exists).
export class ConflictError extends AppError {
  constructor(message: string = "Already exists") {
    super(409, message);
  }
}

// Use for general client-side errors that don't fit other 4xx categories, often due to malformed request syntax.
export class BadRequestError extends AppError {
  constructor(message = "Bad request", public details?: any) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

// Use when the user is authenticated but does not have the necessary permissions to access a resource or perform an action.
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

// Use when a user has sent too many requests in a given amount of time.
export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too many requests, please try again later") {
    super(429, message);
  }
}

// Use for unexpected server-side errors that are not the client's fault. This error typically indicates a bug in the server code.
export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(500, message, false); // isOperational = false (unexpected error)
  }
}

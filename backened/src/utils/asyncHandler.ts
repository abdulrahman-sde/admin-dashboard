import type { NextFunction, Request, Response } from "express";

/**
 * asyncHandler is a higher-order function (HOF) used to wrap async controllers.
 *
 * Key points:
 * 1. asyncHandler is executed immediately at app startup with your controller `fn`.
 * 2. It RETURNS a wrapper function. This returned function is what Express will call
 *    later when an HTTP request comes in.
 * 3. Express injects (req, res, next) into the returned function.
 * 4. The wrapper calls your controller `fn` with those same values.
 * 5. Any async errors are caught and forwarded to Express’s global error handler via next().
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

/* ========================================================================== */
/* ========================= How it works internally ======================== */
/* ========================================================================== */

/**
 * Example: Express route registration
 *
 * router.get("/users", asyncHandler(controller));
 *
 * Internally:
 *
 * 1. At app startup:
 *    asyncHandler(controller) is executed immediately.
 *    This returns a wrapper function, e.g.:
 *
 *    function wrapper(req, res, next) {
 *      Promise.resolve(controller(req, res, next)).catch(next);
 *    }
 *
 * 2. Express stores the wrapper in its routing table:
 *
 *    routes.push({
 *      method: 'GET',
 *      path: '/users',
 *      handler: wrapper
 *    });
 *
 * 3. Later, when a GET /users request arrives:
 *    Express creates the request objects:
 *      const req  = createRequestObject();    // built by Express
 *      const res  = createResponseObject();   // built by Express
 *      const next = createNextFunction();     // built by Express
 *
 *    Express then calls the wrapper:
 *      wrapper(req, res, next)
 *
 *    Inside the wrapper, your controller finally runs:
 *      controller(req, res, next)
 *    If it throws or rejects, .catch(next) ensures the error is passed to your
 *    global error middleware.
 */

/* ========================================================================== */
/* ======================= Why asyncHandler is required ===================== */
/* ========================================================================== */

/**
 * Problem without asyncHandler:
 *
 * router.get("/users", async (req, res) => {
 *   const data = await db.users.findAll();
 *   res.json(data);   // If this throws, Express does NOT catch the error
 * });
 *
 * - Express does NOT automatically handle rejected promises in async functions.
 * - This can cause unhandled promise rejections or app crashes.
 *
 * Solution:
 * - asyncHandler ensures all async errors are caught and forwarded via next()
 *   to the global error handler:
 *
 * app.use((err, req, res, next) => {
 *   res.status(500).json({ message: err.message });
 * });
 *
 * Benefits:
 * - Controllers remain clean (no try/catch boilerplate)
 * - Async errors are consistently handled
 * - Works for all routes and all controllers
 */

/* ========================================================================== */
/* ======================= Event-handler analogy ============================ */
/* ========================================================================== */

/**
 * Similar to JS event listeners:
 *
 * button.addEventListener("click", handleClick);   // pass reference
 * button.addEventListener("click", handleClick()); // ❌ wrong — calls immediately
 *
 * Same in Express:
 * router.get("/users", controller);       // correct — passes reference
 * router.get("/users", controller(req,res,next)); // ❌ wrong — calls immediately at startup
 */

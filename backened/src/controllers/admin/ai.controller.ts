import type { Request, Response } from "express";
import { aiService } from "../../services/ai.service.js";
import { ValidationError } from "../../utils/errors.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const generateDescription = asyncHandler(
  async (req: Request, res: Response) => {
    const { productName } = req.body;

    if (
      !productName ||
      typeof productName !== "string" ||
      productName.length < 3
    ) {
      throw new ValidationError(
        "Product name must be at least 3 characters long"
      );
    }

    const result = await aiService.generateDescription(productName);

    // Pipe the stream to the response
    if (result.body) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      // @ts-ignore - ReadableStream/Node stream mismatch
      const reader = result.body.getReader();
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(value);
        await pump();
      };
      await pump();
    } else {
      res.end();
    }
  }
);

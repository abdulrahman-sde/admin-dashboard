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

    if (result.body) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
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

export const refineBiography = asyncHandler(
  async (req: Request, res: Response) => {
    const { biography } = req.body;

    if (!biography || typeof biography !== "string" || biography.length < 10) {
      throw new ValidationError(
        "Biography must be at least 10 characters long to refine"
      );
    }

    const result = await aiService.refineBiography(biography);

    if (result.body) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
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

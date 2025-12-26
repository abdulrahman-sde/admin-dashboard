import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as categoryController from "../../controllers/admin/categories.controller.js";

const router = Router();

router.post("/", asyncHandler(categoryController.createCategory));
router.get("/", asyncHandler(categoryController.getAllCategories));
router.get("/slug/:slug", asyncHandler(categoryController.getCategoryBySlug));
router.get("/:id", asyncHandler(categoryController.getCategoryById));
router.put("/:id", asyncHandler(categoryController.updateCategory));
router.delete("/:id", asyncHandler(categoryController.deleteCategory));

export default router;

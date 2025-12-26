import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as productController from "../../controllers/admin/products.controller.js";
const router = Router();

router.post("/", asyncHandler(productController.createProduct));
router.post("/bulk-delete", asyncHandler(productController.bulkDeleteProducts));
router.get("/:id", asyncHandler(productController.getProductById));
router.get("/", asyncHandler(productController.getAllProducts));
router.put("/:id", asyncHandler(productController.updateProduct));
router.delete("/:id", asyncHandler(productController.deleteProduct));
export default router;

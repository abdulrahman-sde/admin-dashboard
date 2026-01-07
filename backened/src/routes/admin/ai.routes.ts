import { Router } from "express";
import {
  generateDescription,
  refineBiography,
} from "../../controllers/admin/ai.controller.js";

const router = Router();

router.post("/generate-description", generateDescription);
router.post("/refine-biography", refineBiography);

export default router;

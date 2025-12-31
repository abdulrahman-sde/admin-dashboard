import { Router } from "express";
import { generateDescription } from "../../controllers/admin/ai.controller.js";

const router = Router();

router.post("/generate-description", generateDescription);

export default router;

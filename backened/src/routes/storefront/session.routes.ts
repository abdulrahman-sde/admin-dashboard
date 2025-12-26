import { Router } from "express";
import { createSessionEvent } from "../../controllers/storefront/session.controller.js";

const router = Router();

router.post("/events", createSessionEvent);

export default router;

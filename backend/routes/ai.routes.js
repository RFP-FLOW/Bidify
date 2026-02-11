import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { recommendVendorsByAI } from "../controllers/aiRfp.controller.js";

const router = express.Router();

// Only authenticated employee/manager can access
router.post("/recommend/:rfpId", authMiddleware, recommendVendorsByAI);

export default router;

import express from "express";
import {
  createRFP,
  getEmployeeRFPs,
  getRFPStats,
  getRFPById,
} from "../controllers/rfpController.js";
import { generateRFP } from "../controllers/aiRfp.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * AI Generate RFP
 * POST /api/rfp/generate
 */
router.post("/generate", authMiddleware, generateRFP);

/**
 * Get dashboard stats
 * GET /api/rfp/stats
 */
router.get("/stats", authMiddleware, getRFPStats);

/**
 * Get all RFPs of logged-in employee
 * GET /api/rfp/employee
 */
router.get("/employee", authMiddleware, getEmployeeRFPs);

/**
 * Get single RFP by ID
 * GET /api/rfp/:id
 */
router.get("/:id", authMiddleware, getRFPById);

/**
 * Create new RFP (DRAFT)
 * POST /api/rfp
 */
router.post("/", authMiddleware, createRFP);

export default router;

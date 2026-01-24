import express from "express";
import {
  createRFP,
  getEmployeeRFPs,
  getRFPStats,
} from "../controllers/rfpController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Create new RFP (DRAFT)
 * POST /api/rfp
 */
router.post("/", authMiddleware, createRFP);

/**
 * Get all RFPs of logged-in employee
 * GET /api/rfp/employee
 */
router.get("/employee", authMiddleware, getEmployeeRFPs);

/**
 * Get dashboard stats
 * GET /api/rfp/stats
 */
router.get("/stats", authMiddleware, getRFPStats);

export default router;

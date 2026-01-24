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
 * Create new RFP (DRAFT)
 * POST /api/rfp
 */
router.post("/generate", authMiddleware, generateRFP);
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
// GET single RFP by ID
router.get("/:id", authMiddleware, getRFPById);
router.get("/stats", authMiddleware, getRFPStats);
router.get("/:id", authMiddleware, async (req, res) => {
  const rfp = await RFP.findById(req.params.id);
  res.json(rfp);
});


export default router;

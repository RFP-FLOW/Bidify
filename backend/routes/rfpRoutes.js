import express from "express";
import {
  createRFP,
  getEmployeeRFPs,
  getRFPStats,
  getRFPById,
  sendRFPToVendors,
  updateRFP,
  getEmployeeBids,
} from "../controllers/rfpController.js";
import { generateRFP } from "../controllers/aiRfp.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getRfpProposals } from "../controllers/vendorRfp.controller.js";

const router = express.Router();

/**
 * AI Generate RFP
 */
router.post("/generate", authMiddleware, generateRFP);

/**
 * Dashboard stats
 */
router.get("/stats", authMiddleware, getRFPStats);

/**
 * Employee RFPs
 */
router.get("/employee", authMiddleware, getEmployeeRFPs);

/**
 * Employee Bids (SENT RFPs + bid count)
 */
router.get("/bids", authMiddleware, getEmployeeBids);


/**
 * Get single RFP
 */
router.get("/:id", authMiddleware, getRFPById);

/**
 * Create RFP
 */
router.post("/", authMiddleware, createRFP);


router.put("/:id", authMiddleware, updateRFP);
router.get("/:rfpId/proposals", authMiddleware, getRfpProposals);


/**
 * 🚀 SEND RFP TO VENDORS (FIXED)
 */
router.post("/:rfpId/send", authMiddleware, sendRFPToVendors);

export default router;

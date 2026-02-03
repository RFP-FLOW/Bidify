import express from "express";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import { getVendorOpenRFPs } from "../controllers/vendorRfp.controller.js";

const router = express.Router();

/**
 * Vendor → Open RFPs
 */
router.get(
  "/open-rfps",
  authMiddleware,
  vendorOnly,
  getVendorOpenRFPs
);

export default router;

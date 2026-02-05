import express from "express";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import { submitVendorReply, getOpenRFPsForVendor } from "../controllers/vendorReply.controller.js";

const router = express.Router();

/**
 * @route   POST /api/vendor-reply/replies
 * @desc    Vendor creates or updates reply for an RFP
 * @access  Vendor
 */
router.post(
  "/replies",
  authMiddleware,
  vendorOnly,
  submitVendorReply
);

router.get(
  "/open-rfps",
  authMiddleware,
  vendorOnly,
  getOpenRFPsForVendor
);

export default router;

import express from "express";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import { submitVendorReply, getVendorOpenRFPs } from "../controllers/vendorReply.controller.js";
import  upload  from "../middlewares/upload.middleware.js";

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
  upload.single("attachment"),
  submitVendorReply
);

router.get(
  "/open-rfps",
  authMiddleware,
  vendorOnly,
  getVendorOpenRFPs
);

export default router;

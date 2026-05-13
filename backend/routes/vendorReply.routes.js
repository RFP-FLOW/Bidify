import express from "express";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import { submitVendorReply, getVendorOpenRFPs, getMyProposals } from "../controllers/vendorReply.controller.js";
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

router.get(
  "/my-proposals",
  authMiddleware,
  getMyProposals
);
export default router;

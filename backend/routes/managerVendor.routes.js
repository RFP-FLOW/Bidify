import express from "express";
import authMiddleware, { managerOnly } from "../middlewares/auth.middleware.js";
import {
  getPendingVendorRequests,
  acceptVendorRequest,
  rejectVendorRequest,
  getAcceptedVendors,
} from "../controllers/companyVendor.controller.js";

const router = express.Router();

// 🔐 all routes protected
router.use(authMiddleware);

// 👨‍💼 Manager only
router.get("/vendor-requests", managerOnly, getPendingVendorRequests);
router.patch("/vendor-requests/:requestId/accept", managerOnly, acceptVendorRequest);
router.patch("/vendor-requests/:requestId/reject", managerOnly, rejectVendorRequest);

// 👩‍💻 Employee + Manager → approved vendors (for RFP modal)
router.get("/vendors/approved", getAcceptedVendors);

export default router;

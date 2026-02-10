import express from "express";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import {
  sendVendorRequest,
  getVendorRequests,
  checkRequestStatus,
} from "../controllers/VendorRequest.controller.js";

const router = express.Router();

// 🔐 Vendor protected routes
router.use(authMiddleware, vendorOnly);

// 📤 Send request
router.post("/request", sendVendorRequest);

// 📄 Get all my requests
router.get("/requests", getVendorRequests);

// 🔍 Check request status for company
router.get("/request-status/:companyId", checkRequestStatus);

export default router;

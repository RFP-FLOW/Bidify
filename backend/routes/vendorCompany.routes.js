import express from "express";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import { getAllCompanies } from "../controllers/companyauth.controller.js";
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

// 📋 Get all companies (for vendor to browse)
router.get("/companies", getAllCompanies);

export default router;

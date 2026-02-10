import express from "express";
import { loginVendor, getVendorRFPs, getVendorStats, resendVendorOtp, verifyVendorOtp, vendorRegisterInit } from "../controllers/vendorauth.controller.js";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import { sendVendorRequest,getVendorRequests,checkRequestStatus } from "../controllers/VendorRequest.controller.js";
const router = express.Router();

router.post("/register-init", vendorRegisterInit);
router.post("/verify-otp", verifyVendorOtp);
router.post("/resend-otp", resendVendorOtp);
router.post("/login", loginVendor);
router.get("/dashboard/stats", authMiddleware, vendorOnly, getVendorStats);
router.get("/rfps", authMiddleware, vendorOnly, getVendorRFPs);

router.post("/request", authMiddleware, vendorOnly, sendVendorRequest);
router.get("/request", authMiddleware, vendorOnly, getVendorRequests);
router.get("/request-status/:companyId", authMiddleware, vendorOnly, checkRequestStatus);


export default router;

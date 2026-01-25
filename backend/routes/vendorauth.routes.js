import express from "express";
import { registerVendor, loginVendor, getVendorRFPs, getVendorStats } from "../controllers/vendorauth.controller.js";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.get("/dashboard/stats", authMiddleware, vendorOnly, getVendorStats);
router.get("/rfps", authMiddleware, vendorOnly, getVendorRFPs);

export default router;

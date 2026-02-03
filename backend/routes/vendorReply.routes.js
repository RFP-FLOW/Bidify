import express from "express";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import { submitVendorReply } from "../controllers/vendorReply.controller.js";

console.log("✅ vendorReply.routes loaded");

const router = express.Router();

router.post(
  "/replies",                // ✅ IMPORTANT
  authMiddleware,
  vendorOnly,
  submitVendorReply
);

export default router;

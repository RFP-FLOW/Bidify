import express from "express";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import {
  sendVendorRequest,
  checkRequestStatus,
} from "../controllers/VendorRequest.controller.js";

const router = express.Router();

router.use(authMiddleware, vendorOnly);

// vendor → company
router.post("/request", sendVendorRequest);
router.get("/request-status/:companyId", checkRequestStatus);

export default router;

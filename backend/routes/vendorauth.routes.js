import express from "express";
import { registerVendor, loginVendor, getVendorRFPs, getVendorStats } from "../controllers/vendorauth.controller.js";
import authMiddleware, { vendorOnly } from "../middlewares/auth.middleware.js";
import VendorRequest from "../models/vendorRequest.js";

const router = express.Router();

router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.get("/dashboard/stats", authMiddleware, vendorOnly, getVendorStats);
router.get("/rfps", authMiddleware, vendorOnly, getVendorRFPs);
/* SEND REQUEST TO COMPANY */
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { companyId } = req.body;

    // prevent duplicate request
    const existing = await VendorRequest.findOne({
      vendorId,
      companyId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const request = await VendorRequest.create({
      vendorId,
      companyId,
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send request" });
  }
});

/* GET VENDOR REQUESTS */
router.get("/request", authMiddleware, async (req, res) => {
  try {
    const vendorId = req.user.id;

    const requests = await VendorRequest.find({ vendorId })
      .populate("companyId", "companyName");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});
router.post("/submit-proposal", authMiddleware, vendorOnly, async (req, res) => {
  const { rfpId, quotedPrice, message } = req.body;

  const proposal = await Proposal.create({
    vendorId: req.user.id,
    rfpId,
    quotedPrice,
    message,
  });

  res.status(201).json({
    message: "Proposal submitted",
    proposal,
  });
});
router.get("/request-status/:companyId", authMiddleware, vendorOnly, async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { companyId } = req.params;

    const existing = await VendorRequest.findOne({
      vendorId,
      companyId,
    });

    res.json({ requested: !!existing });
  } catch (err) {
    res.status(500).json({ message: "Failed to check request status" });
  }
});


export default router;

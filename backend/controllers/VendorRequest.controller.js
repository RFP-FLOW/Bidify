import Vendor from "../models/Vendor.js";
import VendorRequest from "../models/vendorRequest.js";

/* SEND REQUEST TO COMPANY */
export const sendVendorRequest = async (req, res) => {
  try {
    const { companyId } = req.body;

    // 🔥 get Vendor profile (NOT user)
    const vendor = await Vendor.findOne({ email: req.user.email });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor profile not found",
      });
    }

    // prevent duplicate request
    const existing = await VendorRequest.findOne({
      vendorId: vendor._id,
      companyId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const request = await VendorRequest.create({
      vendorId: vendor._id, // ✅ CORRECT
      companyId,
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send request" });
  }
};

/* GET VENDOR REQUESTS */
export const getVendorRequests = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ email: req.user.email });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor profile not found",
      });
    }

    const requests = await VendorRequest.find({
      vendorId: vendor._id,
    }).populate("companyId", "companyName");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/* CHECK REQUEST STATUS */
export const checkRequestStatus = async (req, res) => {
  try {
    const { companyId } = req.params;

    const vendor = await Vendor.findOne({ email: req.user.email });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor profile not found",
      });
    }

    const existing = await VendorRequest.findOne({
      vendorId: vendor._id,
      companyId,
    });

    res.json({ requested: !!existing });
  } catch (error) {
    res.status(500).json({ message: "Failed to check request status" });
  }
};

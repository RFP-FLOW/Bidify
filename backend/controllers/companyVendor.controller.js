
import Company from "../models/company.js";
import Vendor from "../models/Vendor.js";
import VendorRequest from "../models/vendorRequest.js";


//-----PENDING VENDORS DETAILS-------
export const getPendingVendorRequests = async (req, res) => {
  try {
    const companyId = req.user.companyId; // manager linked company

    const requests = await VendorRequest.find({
      companyId,
      status: "PENDING",
    })
      .populate("vendorId", "name email phone businessName address gstNumber")
      .sort({ createdAt: -1 });
       
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//-----ACCEPT VENDOR REQUEST


export const acceptVendorRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const managerId = req.user._id;

    const request = await VendorRequest.findById(requestId);

    if (!request || request.status !== "PENDING") {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed",
      });
    }

    request.status = "APPROVED";
    request.reviewedBy = managerId;
    await request.save();

    await Company.findByIdAndUpdate(
      request.companyId,
      { $addToSet: { acceptedVendors: request.vendorId } }
    );

    res.status(200).json({
      success: true,
      message: "Vendor accepted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//-------REJECT REQUEST----------
export const rejectVendorRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const managerId = req.user._id;

    const request = await VendorRequest.findById(requestId);

    if (!request || request.status !== "PENDING") {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed",
      });
    }

    request.status = "REJECTED";
    request.reviewedBy = managerId;
    await request.save();

    res.status(200).json({
      success: true,
      message: "Vendor request rejected",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//----------GET ACCEPTED VENDOR------------
export const getAcceptedVendors = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const company = await Company.findById(companyId)
      .populate("acceptedVendors", "name email phone")
      .select("acceptedVendors");

    res.status(200).json({
      success: true,
      data: company.acceptedVendors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
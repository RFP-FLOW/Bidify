
import Company from "../models/Company.js";
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

    if (request.companyId.toString() !== req.user.companyId) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized approval attempt",
  });
}

    request.status = "APPROVED";
    request.reviewedBy = managerId;
    await request.save();

    await Company.findByIdAndUpdate(
      request.companyId,
      { $addToSet: { acceptedVendors: request.vendorId } }
    );

    await Vendor.findByIdAndUpdate(
  request.vendorId,
  { $addToSet: { approvedCompanies: request.companyId } }
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
    console.log("companyId from token:", req.user.companyId);

    const vendors = await VendorRequest.find({
      vendorId: { $exists: true },
      status: "APPROVED",
      companyId: req.user.companyId,
    }).populate(
      "vendorId",
      "name email phone gstNumber businessName description address"
    );

    res.status(200).json({
      success: true,
      data: vendors.map(v => v.vendorId),
    });
  } catch (error) {
    console.error("GET ACCEPTED VENDORS ERROR:", error); // 👈 IMPORTANT
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


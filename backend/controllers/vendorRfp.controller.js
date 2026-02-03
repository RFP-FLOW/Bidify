import RFP from "../models/RFP.js";
// Vendor ko kaunse RFPs mile hain wo dikhana
/**
 * @desc    Get Open RFPs for logged-in Vendor
 * @route   GET /api/vendor/open-rfps
 * @access  Vendor
 */
export const getVendorOpenRFPs = async (req, res) => {
  try {
    // JWT se vendor id
    const vendorId = req.user.id;

    const rfps = await RFP.find({
      sentToVendors: vendorId,
      status: { $in: ["SENT", "FORWARDED"] },
    })
      .populate("companyId", "companyName")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rfps.length,
      data: rfps,
    });
  } catch (error) {
    console.error("GET VENDOR OPEN RFPs ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch vendor RFPs",
    });
  }
};

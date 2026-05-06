import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";

export const getRfpProposals = async (req, res) => {
  try {
    const { rfpId } = req.params;

    const rfp = await RFP.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({
        message: "RFP not found",
      });
    }

    const proposals = await Proposal.find({ rfpId })
      .populate("vendorId", "name email businessName")
      .select("vendorId message quotedPrice deliveryDays attachment status updatedAt")
      .sort({ createdAt: -1 });

    console.log("getRfpProposals - Found", proposals.length, "proposals");

    res.status(200).json({
      rfpTitle: rfp.title,
      proposals,
    });
  } catch (error) {
    console.error("GET RFP PROPOSALS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch proposals",
    });
  }
};



export const getApprovedProposals = async (req, res) => {
  try {
    const vendorId = req.user._id;

    // 🔴 Fetch accepted proposals with RFP + Company
    const proposals = await Proposal.find({
      vendorId,
      status: "ACCEPTED",
    })
      .populate({
        path: "rfpId",
        select: "title companyId",
        populate: {
          path: "companyId",
          select: "companyName gstNumber createdBy",
          populate: {
            path: "createdBy",
            select: "email",
          },
        },
      })
      .sort({ updatedAt: -1 });

    // 🔴 Format response (safe mapping)
    const data = proposals.map((p) => ({
      rfpTitle: p.rfpId?.title || "RFP",

      // ✅ Company details
      companyName: p.rfpId?.companyId?.companyName || "Company",
      companyEmail: p.rfpId?.companyId?.createdBy?.email || "",
      companyGst: p.rfpId?.companyId?.gstNumber || "N/A",

      // ✅ Proposal details
      price: p.quotedPrice || 0,
      deliveryDays: p.deliveryDays || 0,
      attachment: p.attachment || null,

      // ✅ Meta
      approvedAt: p.updatedAt,
    }));

    res.status(200).json({
      success: true,
      proposals: data,
    });
  } catch (error) {
    console.error("getApprovedProposals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved proposals",
    });
  }
};
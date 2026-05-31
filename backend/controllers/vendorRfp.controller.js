import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";


export const getApprovedProposals = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const proposals = await Proposal.find({
      vendorId,
      status: "ACCEPTED",
    })
      .populate({
        path: "rfpId",
        select:
          "title companyId aiRecommendationCache",
        populate: {
          path: "companyId",
          select:
            "companyName gstNumber createdBy",
          populate: {
            path: "createdBy",
            select: "email",
          },
        },
      })
      .populate("vendorId", "name")
      .sort({ updatedAt: -1 });

    const data = proposals.map((p) => {

      let finalPrice =
        Number(p.quotedPrice) || 0;

      // ✅ fallback from AI cache
      if (
        !finalPrice &&
        p.rfpId?.aiRecommendationCache
      ) {
        const vendorsAnalysis =
          p.rfpId.aiRecommendationCache
            ?.vendorsAnalysis ||
          p.rfpId.aiRecommendationCache
            ?.recommendation
            ?.vendorsAnalysis ||
          [];

        const aiVendor =
          vendorsAnalysis.find(
            (v) =>
              v.vendor
                ?.replace(/\s+/g, " ")
                .trim()
                .toLowerCase() ===
              p.vendorId?.name
                ?.replace(/\s+/g, " ")
                .trim()
                .toLowerCase()
          );

        console.log(
          "Matched AI Vendor:",
          aiVendor
        );

        if (aiVendor?.grandTotal) {
          finalPrice = Number(
            aiVendor.grandTotal
          );
        }
      }

      return {
        rfpTitle:
          p.rfpId?.title || "RFP",

        companyName:
          p.rfpId?.companyId
            ?.companyName || "Company",

        companyEmail:
          p.rfpId?.companyId
            ?.createdBy?.email || "",

        companyGst:
          p.rfpId?.companyId
            ?.gstNumber || "N/A",

        price: finalPrice,

        deliveryDays:
          p.deliveryDays || 0,

        attachment:
          p.attachment || null,

        approvedAt:
          p.updatedAt,
      };
    });

    console.log(
      "APPROVED PROPOSALS:",
      data
    );

    return res.status(200).json({
      success: true,
      proposals: data,
    });

  } catch (error) {
    console.error(
      "getApprovedProposals error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch approved proposals",
    });
  }
};
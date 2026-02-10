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
      .sort({ createdAt: -1 });

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

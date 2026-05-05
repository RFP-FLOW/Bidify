import { generateRFPWithAI, compareVendorsWithAI } from "../services/gemini.service.js";
import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";
import { parseFile } from "../utils/fileParser.js";

/* ================= GENERATE RFP ================= */
export const generateRFP = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const aiResult = await generateRFPWithAI(prompt);

    return res.status(200).json({
      success: true,
      data: aiResult,
    });
  } catch (error) {
    console.error("AI RFP Generation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate RFP using AI",
    });
  }
};


/* ================= RECOMMEND VENDORS ================= */
export const recommendVendorsByAI = async (req, res) => {
  try {
    const { rfpId } = req.params;

    // 1. RFP validate
    const rfp = await RFP.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({
        success: false,
        message: "RFP not found",
      });
    }

    // ❌ DISABLED CACHE (important for now)
    // comment/remove cache block to avoid stale data

    // 2. Get proposals
   const proposals = await Proposal.find({
  rfpId,
  status: "PENDING", // 🔴 ONLY pending
}).populate("vendorId", "name email");

    if (!proposals || proposals.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least two vendor proposals are required",
      });
    }

    // 3. Normalize for AI
    const normalizedProposals = [];

    for (const p of proposals) {
      let fullContent = p.message || "";

      if (p.attachment) {
        const { text } = await parseFile(p.attachment);
        fullContent += "\n\nAttachment Content:\n" + text;
      }

      normalizedProposals.push({
        vendor: p.vendorId?.name,
        email: p.vendorId?.email,
        content: fullContent,
        extractedPrice: p.quotedPrice || 0,
        deliveryDays: p.deliveryDays || 0,
      });
    }

    // 4. AI call (only for analysis, NOT for IDs)
    const prompt = `
Compare vendor proposals and rank best vendors.

Return ONLY JSON with:
- vendorsAnalysis
- topRecommendations (vendor, email, grandTotal)

Vendor Proposals:
${JSON.stringify(normalizedProposals)}
`;

    const aiResult = await compareVendorsWithAI(prompt);

    // 🔴 🔥 CRITICAL FIX: FORCE attach proposalId from DB
    const proposalMap = {};

    proposals.forEach((p) => {
      const key = p.vendorId?.name?.trim().toLowerCase();
      proposalMap[key] = p;
    });

    aiResult.topRecommendations = proposals.map((p) => ({
  vendor: p.vendorId?.name,
  email: p.vendorId?.email,
  grandTotal: p.quotedPrice,
  deliveryDays: p.deliveryDays,
   status: p.status,
  proposalId: p._id // ✅ GUARANTEED
}));

    // 🔴 DEBUG (check in terminal)
    console.log("FINAL RESPONSE:", aiResult.topRecommendations);

    return res.status(200).json({
      success: true,
      recommendation: aiResult,
    });

  } catch (error) {
    console.error("AI Vendor Comparison Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to compare vendor proposals using AI",
    });
  }
};
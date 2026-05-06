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

    // 2. Get proposals (ALL statuses, not just PENDING)
    const proposals = await Proposal.find({ rfpId })
      .populate("vendorId", "name email")
      .lean();

    console.log("DEBUG - Raw proposals from DB count:", proposals.length);
    if (proposals.length > 0) {
      console.log("First proposal:", {
        vendor: proposals[0].vendorId?.name,
        quotedPrice: proposals[0].quotedPrice,
        deliveryDays: proposals[0].deliveryDays
      });
    }

    if (!proposals || proposals.length < 1) {
      return res.status(400).json({
        success: false,
        message: "At least one vendor proposal is required",
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

    // Enrich vendorsAnalysis with delivery days and grandTotal from DB proposals
    if (aiResult.vendorsAnalysis) {
      aiResult.vendorsAnalysis = aiResult.vendorsAnalysis.map((v) => {
        const dbProposal = proposalMap[v.vendor?.trim().toLowerCase()];
        return {
          ...v,
          deliveryDays: Number(dbProposal?.deliveryDays) || 0,
          grandTotal: Number(v.grandTotal) || 0,
        };
      });
    }

    // Build topRecommendations from AI analysis (which has extracted prices)
    // Instead of using DB quotedPrice (which is often empty)
    aiResult.topRecommendations = (aiResult.vendorsAnalysis || [])
      .map((v) => {
        const dbProposal = proposalMap[v.vendor?.trim().toLowerCase()];
        return {
          vendor: v.vendor,
          email: dbProposal?.vendorId?.email || "",
          grandTotal: Number(v.grandTotal) || 0,
          extractedPrice: Number(v.grandTotal) || 0,
          deliveryDays: Number(v.deliveryDays) || 0,
          status: dbProposal?.status || "PENDING",
          proposalId: dbProposal?._id || "",
        };
      })
      .sort((a, b) => a.grandTotal - b.grandTotal);

    // 🔴 DEBUG (check in terminal)
    console.log("✅ AI Analysis Complete - Top Recs:", aiResult.topRecommendations?.length || 0);

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
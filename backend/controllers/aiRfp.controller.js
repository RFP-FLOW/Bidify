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
const aiCache = new Map();

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

    // ================= CACHE CHECK =================
    const cached = aiCache.get(rfpId);

    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      console.log("✅ Returning AI result from cache");

      return res.status(200).json({
        success: true,
        recommendation: cached.data,
        cached: true,
      });
    }

    // 2. Get proposals
    const proposals = await Proposal.find({ rfpId })
      .populate("vendorId", "name email")
      .lean();

    //console.log("DEBUG - Raw proposals count:", proposals.length);

    if (!proposals || proposals.length < 1) {
      return res.status(400).json({
        success: false,
        message: "At least one vendor proposal is required",
      });
    }

    // 3. Normalize proposals
    const normalizedProposals = [];

    for (const p of proposals) {
      let fullContent = p.message || "";

      if (p.attachment) {
        try {
          const { text } = await parseFile(p.attachment);
          fullContent += "\n\nAttachment Content:\n" + text;
        } catch (err) {
          console.log("Attachment parse skipped");
        }
      }

      normalizedProposals.push({
        vendor: p.vendorId?.name,
        email: p.vendorId?.email,
        content: fullContent,
        extractedPrice: p.quotedPrice || 0,
        deliveryDays: p.deliveryDays || 0,
      });
    }

    // ================= AI PROMPT =================
    const prompt = `
Compare these vendor proposals and recommend the best vendors.

Return ONLY valid JSON.

DO NOT write explanation text.
DO NOT use markdown.
DO NOT wrap in \`\`\`

Required JSON structure:

{
  "vendorsAnalysis": [
    {
      "vendor": "",
      "grandTotal": 0,
      "deliveryDays": 0,
      "reason": ""
    }
  ]
}

Vendor Proposals:
${JSON.stringify(normalizedProposals)}
`;

    // ================= AI CALL =================
    let aiResultRaw = await compareVendorsWithAI(prompt);

    // Fix invalid JSON response
    if (typeof aiResultRaw === "string") {
      aiResultRaw = aiResultRaw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      aiResultRaw = JSON.parse(aiResultRaw);
    }

    const aiResult = aiResultRaw;

    // ================= PROPOSAL MAP =================
    const proposalMap = {};

    proposals.forEach((p) => {
      const key = p.vendorId?.name?.trim().toLowerCase();

      proposalMap[key] = p;
    });

    // ================= ANALYSIS ENRICH =================
    if (aiResult.vendorsAnalysis) {
      aiResult.vendorsAnalysis = aiResult.vendorsAnalysis.map((v) => {
        const dbProposal =
          proposalMap[v.vendor?.trim().toLowerCase()];

        return {
          ...v,

          vendor: v.vendor,

          email: dbProposal?.vendorId?.email || "",

          deliveryDays:
            Number(dbProposal?.deliveryDays) || 0,

          grandTotal:
            Number(v.grandTotal) || 0,

          proposalId:
            dbProposal?._id || "",

          attachment:
            dbProposal?.attachment || "",

          status:
            dbProposal?.status || "PENDING",

          reason:
            v.reason ||
            "Good pricing and delivery timeline",
        };
      });
    }

    // ================= TOP RECOMMENDATIONS =================
    aiResult.topRecommendations = (
      aiResult.vendorsAnalysis || []
    )
      .sort((a, b) => a.grandTotal - b.grandTotal)
      .slice(0, 3);

    // ================= SAVE CACHE =================
    aiCache.set(rfpId, {
      data: aiResult,
      timestamp: Date.now(),
    });

    console.log("✅ AI result cached");

    console.log(
      "✅ AI Analysis Complete:",
      aiResult.topRecommendations?.length || 0
    );

    return res.status(200).json({
      success: true,
      recommendation: aiResult,
    });
  } catch (error) {
    console.error(
      "AI Vendor Comparison Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to compare vendor proposals using AI",
    });
  }
};
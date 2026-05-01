import { generateRFPWithAI, compareVendorsWithAI } from "../services/gemini.service.js";
import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";
//import { extractTextFromPDF } from "../utils/pdf.utils.js";
import { parseFile } from "../utils/fileParser.js";



/**
 * @desc    Generate RFP structure using AI
 * @route   POST /api/rfp/generate
 * @access  Employee
 */
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


/**
 * @desc    Compare vendor proposals using AI and recommend best vendor
 * @route   POST /api/ai/recommend/:rfpId
 * @access  Employee
 */
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

    // 2. Fetch vendor proposals
    const proposals = await Proposal.find({ rfpId })
  .populate("vendorId", "name email");

    if (!proposals || proposals.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least two vendor proposals are required for comparison",
      });
    }

    // 3. Normalize proposal data
   const normalizedProposals = [];

for (const p of proposals) {
  let fullContent = p.message || "";

  // If attachment exists → extract text
 if (p.attachment) {
  const { text } = await parseFile(p.attachment);

  fullContent += "\n\nAttachment Content:\n" + text;
}

  normalizedProposals.push({
    vendor: p.vendorId?.name,
    email: p.vendorId?.email,
    content: fullContent,

      extractedPrice: p.quotedPrice || 0,
  deliveryDays: p.deliveryDays || 0

  });
}


    // 4. Call AI for comparison
const prompt = `
You are an enterprise procurement decision engine.

Your job is to compare vendor proposals and recommend the best vendors.

IMPORTANT RULES:

1. If "extractedPrice" is provided, ALWAYS use it as the final price.
   Do NOT recalculate from text unless it is missing or zero.

2. Use "deliveryDays" if provided.

3. Lower total price is better.

4. If two vendors have similar price, prefer faster delivery.

5. Rank vendors from BEST to WORST.

6. Recommend top 3 vendors.
   - If vendors <= 3, recommend all.
   - Best vendor must be first.

Return ONLY valid JSON.

Format:
{
  "vendorsAnalysis": [
    {
      "vendor": "",
      "email": "",
      "grandTotal": number,
      "deliveryDays": number,
      "reason": ""
    }
  ],
  "topRecommendations": [
    {
      "vendor": "",
      "email": "",
      "grandTotal": number
    }
  ]
}

RFP Items:
${JSON.stringify(rfp.items)}

Vendor Proposals:
${JSON.stringify(normalizedProposals)}
`;

const aiResult = await compareVendorsWithAI(prompt);
//console.log("AI RESULT:", aiResult);
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


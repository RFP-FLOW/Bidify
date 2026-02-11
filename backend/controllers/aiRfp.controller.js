import { generateRFPWithAI, compareVendorsWithAI } from "../services/gemini.service.js";
import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";
import { extractTextFromPDF } from "../utils/pdf.utils.js";


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
    const pdfText = await extractTextFromPDF(p.attachment);
    fullContent += "\n\nAttachment Content:\n" + pdfText;
  }

  normalizedProposals.push({
    vendor: p.vendorId?.name,
    email: p.vendorId?.email,
    content: fullContent
  });
}


    // 4. Call AI for comparison
const prompt = `
You are an enterprise procurement decision engine.

Your tasks:

1. Extract unit pricing from vendor proposals.
2. Calculate:
   - total price per item (unit price × quantity)
   - delivery charges (if mentioned)
   - grand total
3. Compare vendors based on grand total.
4. Rank vendors from lowest total to highest.
5. Recommend top 3 vendors.
   - If vendors <= 3, recommend all.
   - Best vendor must appear first.

Return ONLY valid JSON.

Format:
{
  "vendorsAnalysis": [
    {
      "vendor": "",
      "email": "",
      "itemBreakdown": [
        {
          "item": "",
          "unitPrice": number,
          "quantity": number,
          "totalItemPrice": number
        }
      ],
      "deliveryCharge": number,
      "grandTotal": number
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


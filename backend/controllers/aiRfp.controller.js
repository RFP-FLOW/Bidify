import { generateRFPWithAI } from "../services/gemini.service.js";

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

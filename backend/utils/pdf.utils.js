import fs from "fs";
import path from "path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/* =====================================================
   📄 EXTRACT TEXT FROM PDF
===================================================== */
export const extractTextFromPDF = async (storedPath) => {
  try {
    if (!storedPath) return "";

    const absolutePath = fs.existsSync(storedPath)
      ? storedPath
      : path.join(process.cwd(), "uploads", path.basename(storedPath));

    const data = new Uint8Array(fs.readFileSync(absolutePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n";
    }

    return fullText;

  } catch (error) {
    console.error("PDF Extraction Error:", error);
    return "";
  }
};

/* =====================================================
   🧠 EXTRACT PRICE + DELIVERY
===================================================== */
export const extractDetailsFromText = (text) => {
  if (!text) return { total: 0, deliveryDays: 0 };

  const cleanText = text.replace(/\n/g, " ").toLowerCase();

  /* ===============================
     💰 TOTAL (MULTI REGEX)
  =============================== */
  let total = 0;

  const totalPatterns = [
    /grand\s*total[:\s\-]*?(rs\.?|inr)?\s*([\d,]+)/i,
    /total\s*(cost|amount)?[:=\s\-]*?(rs\.?|inr)?\s*([\d,]+)/i,
    /(amount\s*payable)[:=\s\-]*?(rs\.?|inr)?\s*([\d,]+)/i,
    /(rs\.?|inr)\s*([\d,]+)/i
  ];

  for (const pattern of totalPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const value = match[match.length - 1];
      total = parseInt(value.replace(/,/g, ""));
      break;
    }
  }

  /* ===============================
     🚚 DELIVERY (MULTI REGEX)
  =============================== */
  let deliveryDays = 0;

  const deliveryPatterns = [
    /(\d+)[-\s]?(\d+)?\s*working\s*days/i,
    /delivery\s*(time)?[:=\s]*?(\d+)\s*days/i,
    /within\s*(\d+)\s*days/i
  ];

  for (const pattern of deliveryPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const nums = match.slice(1).filter(Boolean).map(Number);
      deliveryDays =
        nums.length === 2 ? (nums[0] + nums[1]) / 2 : nums[0];
      break;
    }
  }

  return { total, deliveryDays };
};
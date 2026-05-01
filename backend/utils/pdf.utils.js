import fs from "fs";
import path from "path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import Tesseract from "tesseract.js";
import AdmZip from "adm-zip";

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
   🖼️ EXTRACT TEXT FROM IMAGE (OCR)
===================================================== */
const extractTextFromImage = async (storedPath) => {
  try {
    const absolutePath = path.join(
      process.cwd(),
      "uploads",
      path.basename(storedPath)
    );

    const result = await Tesseract.recognize(absolutePath, "eng");

    return result.data.text;

  } catch (error) {
    console.error("Image OCR Error:", error);
    return "";
  }
};

/* =====================================================
   📦 EXTRACT TEXT FROM ZIP (PDFs inside)
===================================================== */
const extractTextFromZip = async (storedPath) => {
  try {
    const absolutePath = path.join(
      process.cwd(),
      "uploads",
      path.basename(storedPath)
    );

    const zip = new AdmZip(absolutePath);
    const entries = zip.getEntries();

    let combinedText = "";

    for (const entry of entries) {
      if (entry.entryName.endsWith(".pdf")) {
        const tempPath = path.join(
          process.cwd(),
          "uploads",
          entry.entryName
        );

        fs.writeFileSync(tempPath, entry.getData());

        const text = await extractTextFromPDF(tempPath);
        combinedText += text + " ";

        // 🔥 Optional cleanup
        fs.unlinkSync(tempPath);
      }
    }

    return combinedText;

  } catch (error) {
    console.error("ZIP Extraction Error:", error);
    return "";
  }
};

/* =====================================================
   🧠 EXTRACT IMPORTANT DATA (PRICE + DELIVERY)
===================================================== */
export const extractDetailsFromText = (text) => {
  if (!text) return { total: 0, deliveryDays: 0 };

  const cleanText = text.replace(/\n/g, " ").toLowerCase();

  // 💰 Extract GRAND TOTAL
  const totalMatch = cleanText.match(
    /grand\s*total\s*(rs\.?|inr)?\s*([\d,]+)/i
  );

  let total = 0;
  if (totalMatch) {
    total = parseInt(totalMatch[2].replace(/,/g, ""));
  }

  // 🚚 Extract DELIVERY TIME
  const deliveryMatch = cleanText.match(
    /(\d+)[-\s]?(\d+)?\s*working\s*days/
  );

  let deliveryDays = 0;
  if (deliveryMatch) {
    deliveryDays = deliveryMatch[2]
      ? (parseInt(deliveryMatch[1]) + parseInt(deliveryMatch[2])) / 2
      : parseInt(deliveryMatch[1]);
  }

  return { total, deliveryDays };
};

/* =====================================================
   🚀 MAIN FUNCTION (CALL THIS IN CONTROLLER)
===================================================== */
export const parseFile = async (storedPath) => {
  try {
    if (!storedPath) return { total: 0, deliveryDays: 0 };

    const ext = path.extname(storedPath).toLowerCase();

    let text = "";

    if (ext === ".pdf") {
      text = await extractTextFromPDF(storedPath);
    } 
    else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      text = await extractTextFromImage(storedPath);
    } 
    else if (ext === ".zip") {
      text = await extractTextFromZip(storedPath);
    }

    const { total, deliveryDays } = extractDetailsFromText(text);

    return { total, deliveryDays };

  } catch (error) {
    console.error("File Parsing Error:", error);
    return { total: 0, deliveryDays: 0 };
  }
};
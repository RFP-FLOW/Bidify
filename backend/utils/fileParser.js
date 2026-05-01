import path from "path";
import fs from "fs";
import { extractTextFromPDF, extractDetailsFromText } from "./pdf.utils.js";
import mammoth from "mammoth";
import textract from "textract";
import fetch from "node-fetch";
import os from "os";

/* =====================================================
   🔽 DOWNLOAD FILE (for Cloudinary)
===================================================== */
const downloadFile = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Download failed");

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

/* =====================================================
   🚀 MAIN PARSER FUNCTION
===================================================== */
export const parseFile = async (storedPath) => {
  try {
    if (!storedPath) {
      return { text: "", total: 0, deliveryDays: 0 };
    }

    const isRemote =
      storedPath.startsWith("http://") ||
      storedPath.startsWith("https://");

    const ext = path.extname(storedPath).toLowerCase();

    let absolutePath;

    /* ===============================
       📁 HANDLE PATH
    =============================== */
    if (isRemote) {
      const tempDir = os.tmpdir();
      const tempFile = path.join(tempDir, `temp-${Date.now()}${ext}`);

      const buffer = await downloadFile(storedPath);
      fs.writeFileSync(tempFile, buffer);

      absolutePath = tempFile;
    } else {
      absolutePath = fs.existsSync(storedPath)
        ? storedPath
        : path.join(process.cwd(), storedPath);
    }

    console.log("FINAL PATH:", absolutePath);

    let text = "";

    /* ===============================
       📂 HANDLE FILE TYPES
    =============================== */
    switch (ext) {
      case ".pdf":
        text = await extractTextFromPDF(absolutePath);
        break;

      case ".docx":
        const docxResult = await mammoth.extractRawText({
          path: absolutePath,
        });
        text = docxResult.value;
        break;

      case ".doc":
      case ".ppt":
      case ".pptx":
        text = await new Promise((resolve, reject) => {
          textract.fromFileWithPath(absolutePath, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
        break;

      case ".txt":
        text = fs.readFileSync(absolutePath, "utf-8");
        break;

      default:
        text = "";
    }

    console.log("EXTRACTED TEXT:", text.slice(0, 200));

    /* ===============================
       🧠 EXTRACT DETAILS
    =============================== */
    const { total, deliveryDays } = extractDetailsFromText(text);

    console.log("PARSED RESULT:", { total, deliveryDays });

    return {
      text,
      total,
      deliveryDays,
    };

  } catch (error) {
    console.error("File Parsing Error:", error);
    return {
      text: "",
      total: 0,
      deliveryDays: 0,
    };
  }
};
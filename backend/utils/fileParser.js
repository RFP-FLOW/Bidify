import path from "path";
import fs from "fs";
import { extractTextFromPDF, extractDetailsFromText } from "./pdf.utils.js";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import xml2js from "xml2js";
import Tesseract from "tesseract.js";
import fetch from "node-fetch";
import os from "os";

/* =====================================================
   🔽 DOWNLOAD FILE (for Cloudinary / URL)
===================================================== */
const downloadFile = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);
  return response.buffer();
};

/* =====================================================
   🚀 MAIN PARSER FUNCTION
===================================================== */
export const parseFile = async (storedPath) => {
  try {
    if (!storedPath) {
      return { text: "", total: 0, deliveryDays: 0 };
    }

    const isRemoteUrl =
      storedPath.startsWith("http://") ||
      storedPath.startsWith("https://");

    const ext = path.extname(storedPath).toLowerCase();

    let absolutePath;

    /* ===============================
       📁 HANDLE PATH CORRECTLY (FIXED)
    =============================== */
    if (isRemoteUrl) {
      const tempDir = os.tmpdir();
      const tempFile = path.join(tempDir, `temp-${Date.now()}${ext}`);

      const fileBuffer = await downloadFile(storedPath);
      fs.writeFileSync(tempFile, fileBuffer);

      absolutePath = tempFile;

    } else {
      // 🔥 FIX: handle both full path and relative path

      if (fs.existsSync(storedPath)) {
        absolutePath = storedPath;
      } else {
        absolutePath = path.join(process.cwd(), storedPath);
      }
    }

    // 🔍 DEBUG
    console.log("FILE PATH RECEIVED:", storedPath);
    console.log("FINAL PATH USED:", absolutePath);

    let text = "";

    /* ===============================
       📂 HANDLE FILE TYPES
    =============================== */
    switch (ext) {
      case ".pdf":
        // 🔥 FIX: use absolutePath (NOT storedPath)
        text = await extractTextFromPDF(absolutePath);
        break;

      case ".docx":
        const docxResult = await mammoth.extractRawText({
          path: absolutePath,
        });
        text = docxResult.value;
        break;

      case ".xlsx":
      case ".xls":
        const workbook = XLSX.readFile(absolutePath);
        workbook.SheetNames.forEach((name) => {
          text += XLSX.utils.sheet_to_csv(workbook.Sheets[name]) + " ";
        });
        break;

      case ".xml":
        const xmlData = fs.readFileSync(absolutePath, "utf-8");
        const parser = new xml2js.Parser();
        const parsed = await parser.parseStringPromise(xmlData);
        text = JSON.stringify(parsed);
        break;

      case ".txt":
        text = fs.readFileSync(absolutePath, "utf-8");
        break;

      case ".jpg":
      case ".jpeg":
      case ".png":
        const ocr = await Tesseract.recognize(absolutePath, "eng");
        text = ocr.data.text;
        break;

      default:
        text = "";
    }

    /* ===============================
       🧠 EXTRACT DATA
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
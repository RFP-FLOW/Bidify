import path from "path";
import fs from "fs";
import { extractTextFromPDF } from "./pdf.utils.js";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import xml2js from "xml2js";
import Tesseract from "tesseract.js";

export const extractTextFromFile = async (storedPath) => {
  try {
    if (!storedPath) return "";

    // 🔥 Always extract filename only
    const filename = path.basename(storedPath);

    // 🔥 Build correct absolute path
    const absolutePath = path.join(
      process.cwd(),
      "uploads",
      filename
    );

    const ext = path.extname(filename).toLowerCase();

    switch (ext) {

      case ".pdf":
        return await extractTextFromPDF(filename);

      case ".docx":
        const result = await mammoth.extractRawText({ path: absolutePath });
        return result.value;

      case ".xlsx":
      case ".xls":
        const workbook = XLSX.readFile(absolutePath);
        let sheetText = "";
        workbook.SheetNames.forEach(name => {
          sheetText += XLSX.utils.sheet_to_csv(workbook.Sheets[name]);
        });
        return sheetText;

      case ".xml":
        const xmlData = fs.readFileSync(absolutePath, "utf-8");
        const parser = new xml2js.Parser();
        const parsed = await parser.parseStringPromise(xmlData);
        return JSON.stringify(parsed);

      case ".txt":
        return fs.readFileSync(absolutePath, "utf-8");

      case ".jpg":
      case ".png":
      case ".jpeg":
        const { data: { text } } = await Tesseract.recognize(
          absolutePath,
          "eng"
        );
        console.log("OCR Extracted Text:", text);
        return text;

      default:
        return "";
    }

  } catch (error) {
    console.error("File Parsing Error:", error);
    return "";
  }
};

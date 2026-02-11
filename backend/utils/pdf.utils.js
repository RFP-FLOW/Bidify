import fs from "fs";
import path from "path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";


export const extractTextFromPDF = async (storedPath) => {
  try {
    if (!storedPath) return "";

    const filename = path.basename(storedPath);

    const absolutePath = path.join(
      process.cwd(),
      "uploads",
      filename
    );

    //console.log("Reading PDF from:", absolutePath);

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

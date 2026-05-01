import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Extract file extension cleanly
    const ext = file.originalname.split('.').pop().toLowerCase();
    
    // Determine format if it's a known document type
    const format = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "rar"].includes(ext) ? ext : undefined;

    return {
      folder: "bidify_proposals",
      resource_type: "auto",
      access_mode: "public",
      public_id: `${file.originalname.split('.')[0]}_${Date.now()}`,
      ...(format && { format }),
    };
  },
});

const upload = multer({ storage });

export default upload;
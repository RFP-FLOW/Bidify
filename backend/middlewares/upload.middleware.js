import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
  return {
    folder: "bidify_proposals",
    resource_type: "raw",
    type: "upload", // ensure public
  };
},
});

const upload = multer({ storage });

export default upload;

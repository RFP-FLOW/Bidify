import mongoose from "mongoose";

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    businessName: {
      type: String,
      required: true,
    },

    gstNumber: {
      type: String,
      required: true,
      unique: true,
      match: gstRegex,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "vendor",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);

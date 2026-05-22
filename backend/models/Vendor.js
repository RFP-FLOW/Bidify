import mongoose from "mongoose";

// const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const vendorSchema = new mongoose.Schema(
  {
    name: String,
    businessName: String,
    gstNumber: { type: String, unique: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      default: "vendor",
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    otp: String,
    otpExpiry: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },

    requestedCompanies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],

    approvedCompanies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Vendor", vendorSchema);

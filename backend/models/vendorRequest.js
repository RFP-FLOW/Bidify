import mongoose from "mongoose";

const vendorRequestSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
     appliedAt: {
      type: Date,
      default: Date.now,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // manager
    },
  },
  { timestamps: true }
);

export default mongoose.model("VendorRequest", vendorRequestSchema);

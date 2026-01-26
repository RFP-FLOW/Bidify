import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFP",
    },
    quotedPrice: Number,
    message: String,
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Proposal", proposalSchema);

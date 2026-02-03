import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFP",
      required: true,
    },

    quotedPrice: {
      type: Number,
    },

    message: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },

    replyMode: {
      type: String,
      enum: ["EMAIL", "PLATFORM"],
      default: "PLATFORM",
    },

    repliedAt: {
      type: Date,
      default: Date.now,
    },

    employeeNotified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Proposal", proposalSchema);

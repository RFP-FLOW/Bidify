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
      min: 0,
    },

    message: {
      type: String,
      required: true,
      trim: true,
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

/* ----------------------- Indexes ----------------------- */

// One vendor can reply only once to one RFP
proposalSchema.index(
  { vendorId: 1, rfpId: 1 },
  { unique: true }
);

// Query optimization
proposalSchema.index({ rfpId: 1 });
proposalSchema.index({ vendorId: 1 });

export default mongoose.model("Proposal", proposalSchema);

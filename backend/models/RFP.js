import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    specification: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const rfpSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    items: {
      type: [itemSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["DRAFT", "SENT", "FORWARDED", "CLOSED"],
      default: "DRAFT",
    },

    // employee who created the RFP
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // vendors selected while sending RFP
    vendorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("RFP", rfpSchema);

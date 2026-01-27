import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    gstNumber: {
      type: String,
      unique: true,
      sparse: true, // allows null but unique if present
    },


    address: {
      type: String,
    },

    description: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // manager
      required: true,
    },
    acceptedVendors: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
],

  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);

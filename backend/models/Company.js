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
      uppercase:true,
      match: [
         /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST number",
       ],
    },

    phone:{
      type:String,
      trim:true,
    },

    address: {
      type: String,
    },

    description: {
      type: String,
    },

    website:{
      type:String,
      match: [
          /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
           "Invalid website URL",
          ],
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
    unique:true,
  },
],

  },
  { timestamps: true }
);

export default mongoose.models.Company ||
  mongoose.model("Company", companySchema);


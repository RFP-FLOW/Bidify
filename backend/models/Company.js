import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["manager", "employee"],
      default: "employee",
    },

    isActive: {
      type: Boolean,
      default: false, // employee inactive until password set
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);

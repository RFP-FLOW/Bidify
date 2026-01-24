import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // only for employees
    },

    isActive: {
      type: Boolean,
      default: false, // employees activated after password set
    },

    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

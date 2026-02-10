import { randomBytes } from "crypto";
import sendEmail from "../utils/sendEmail.js";
import Vendor from "../models/Vendor.js";
import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";

const getModelByRole = (role) => {
  if (role === "vendor") return Vendor;
  if (role === "company") return User; // manager / employee
  throw new Error("Invalid role");
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        message: "Email and role are required",
      });
    }

    const Model = getModelByRole(role);

    const user = await Model.findOne({ email });

    // security best practice
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    const resetToken = randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetPath =
      role === "vendor"
        ? `/vendor/reset-password/${resetToken}`
        : `/company/reset-password/${resetToken}`;

    const resetLink = `${process.env.CLIENT_URL}${resetPath}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password – Bidify",
      html: `
        <p>You requested a password reset.</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link is valid for 15 minutes.</p>
      `,
    });

    res.json({
      message: "If the email exists, a reset link has been sent",
    });

  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, role } = req.body;

    if (!password || !role) {
      return res.status(400).json({
        message: "Password and role are required",
      });
    }

    const Model = getModelByRole(role);

    const user = await Model.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.isActive = true;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ message: error.message });
  }
};

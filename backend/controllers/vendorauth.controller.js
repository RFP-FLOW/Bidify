import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const vendorRegisterInit = async (req, res) => {
  try {
    const { name, businessName, gstNumber, email, password } = req.body;

    if (!name || !businessName || !gstNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Vendor.findOne({ email });

    // Already verified → block
    if (existing && existing.isEmailVerified) {
      return res.status(400).json({
        message: "Email already registered. Please login.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    // Case: user exists but not verified → resend OTP
    if (existing && !existing.isEmailVerified) {
      existing.otp = hashedOtp;
      existing.otpExpiry = Date.now() + 10 * 60 * 1000;
      await existing.save();
    }
    // Fresh vendor
    else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await Vendor.create({
        name,
        businessName,
        gstNumber,
        email,
        password: hashedPassword,
        role: "vendor",
        otp: hashedOtp,
        otpExpiry: Date.now() + 10 * 60 * 1000,
        isEmailVerified: false,
        isActive: false,
      });
    }

    await sendEmail({
      to: email,
      subject: "Verify your email – Bidify",
      html: `
        <h3>Your OTP is:</h3>
        <h2>${otp}</h2>
        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyVendorOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const vendor = await Vendor.findOne({
      email,
      otpExpiry: { $gt: Date.now() },
    });

    if (!vendor) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isMatch = await bcrypt.compare(otp, vendor.otp);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    vendor.isEmailVerified = true;
    vendor.isActive = true;
    vendor.otp = undefined;
    vendor.otpExpiry = undefined;

    await vendor.save();

    res.json({ message: "Vendor registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendVendorOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    vendor.otp = hashedOtp;
    vendor.otpExpiry = Date.now() + 10 * 60 * 1000;
    await vendor.save();

    await sendEmail({
      to: email,
      subject: "Resend OTP – Bidify",
      html: `
        <h3>Your OTP is:</h3>
        <h2>${otp}</h2>
        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Vendor.findOne({ email }).select("+password");
    if (!user || !user.isActive) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.json({
      message: "Login successful",
       accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getVendorStats = async (req, res) => {
  res.json({
    pending: 1,
    replied: 2,
    accepted: 3,
  });
};

export const getVendorRFPs = async (req, res) => {
  // res.json([
  //   {
  //     _id: "1",
  //     title: "Laptop Procurement",
  //     description: "Need 20 laptops",
  //     status: "PENDING",
  //     createdAt: new Date(),
  //   },
  // ]);
};

export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user._id).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const { name, businessName, phone } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        name,
        businessName,
        phone,
      },
      { new: true },
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      vendor,
    });
  } catch (error) {
    console.error("UPDATE VENDOR PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

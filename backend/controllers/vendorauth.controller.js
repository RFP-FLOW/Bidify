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

    // Case: user exists but not verified → resend OTP
    if (existing && !existing.isEmailVerified) {
      existing.otp = otp;
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
        otp,
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
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!vendor) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
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

    vendor.otp = otp;
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
    if (!user||!user.isActive) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
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
// export const getVendorStats = async (req, res) => {
//   const vendorId = req.user.id;

//   const total = await Proposal.countDocuments({ vendorId });
//   const accepted = await Proposal.countDocuments({
//     vendorId,
//     status: "ACCEPTED",
//   });
//   const pending = await Proposal.countDocuments({
//     vendorId,
//     status: "PENDING",
//   });

//   res.json({
//     total,
//     pending,
//     accepted,
//   });
// };
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
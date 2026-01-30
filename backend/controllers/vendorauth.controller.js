import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const registerVendor = async (req, res) => {
  try {
    const { name, businessName, gstNumber, email, password } = req.body;

    // basic validation
    if (!name || !businessName || !gstNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // GST format validation (extra safety)
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!gstRegex.test(gstNumber)) {
      return res.status(400).json({ message: "Invalid GST Number format" });
    }

    // check existing email or GST
    const existingUser = await Vendor.findOne({
      $or: [{ email }, { gstNumber }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or GST already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Vendor.create({
      name,
      businessName,
      gstNumber,
      email,
      password: hashedPassword,
      role: "vendor", // ✅ ADD THIS
    });

    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Vendor.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
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



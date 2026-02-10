import User from "../models/UserSchema.js";
import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";


//---------------Register INIT--SEND OTP---------------

export const registerInit = async (req, res) => {
  try {
    const { companyName, username, email, password } = req.body;

    if (!companyName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });

    //Case 1: User exists and already verified->BLOCK
    if (existing && existing.companyId) {
      return res.status(400).json({ message: "Email already registered. Please login!" });
    }
    
     // Case 2: User exists but NOT verified → resend / regenerate OTP
if (existing && !existing.companyId) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  existing.otp = otp;
  existing.otpExpiry = Date.now() + 10 * 60 * 1000;
  await existing.save();

  await sendEmail({
    to: email,
    subject: "Verify your email – Bidify",
    html: `
      <h3>Your OTP is:</h3>
      <h2>${otp}</h2>
      <p>Valid for 10 minutes</p>
    `,
  });

  return res.json({
    message:
      existing.otpExpiry && existing.otpExpiry < Date.now()
        ? "Previous OTP expired. New OTP sent."
        : "OTP re-sent. Please verify your email.",
  });
}


    //Fresh Registration   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword=await bcrypt.hash(password,10);
    // temporary user
    await User.create({
      name:username,
      email,
      password:hashedPassword, // hash later
      role: "manager",
      companyName,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min
      isEmailVerified: false,
    });

    await sendEmail({
      to: email,
      subject: "Verify your email - Bidify",
      html: `
        <h3>Your OTP is:</h3>
        <h2>${otp}</h2>
        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//---------------------VERIFY OTP----------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, companyName } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.companyId) {
      return res.status(400).json({
        message: "Registration already completed. Please login.",
      });
    }

    const company = await Company.create({
      companyName,
      createdBy: user._id,
      acceptedVendors: [], 
    });

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isActive=true;
    user.status="active";
    user.companyId = company._id;


    await user.save();

    res.json({ message: "Company registered successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//---------------------RESEND OTP----------------------
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // 🔐 Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendEmail({
      to: email,
      subject: "Your new OTP – Bidify",
      html: `
        <h3>Email Verification</h3>
        <p>Your new OTP is:</p>
        <h2>${otp}</h2>
        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({ message: "OTP resent successfully" });

  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= LOGIN COMPANY ================= */
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const company = await Company.findById(user.companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role,companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.name,
        email: user.email,
        role: user.role,
        companyId:user.companyId,
        companyName:company.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= ADD EMPLOYEE (MANAGER ONLY) ================= */
export const addEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ FIX 1: correct id
    const managerId = req.user._id;

    // ✅ FIX 2: fetch manager FIRST
    const manager = await User.findById(managerId);

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Only manager can add employee" });
    }

    if (!manager.companyId) {
      return res.status(400).json({ message: "Manager has no company assigned" });
    }

    const existingUser = await User.findOne({ email });

    //CASE 1: ACTIVE EMPLOYEE
    if (existingUser && existingUser.status==="active") {
      return res.status(400).json({ message: "Employee already exists" });
    }


    //Case 2: Invited (RESEND)
    if (
          existingUser &&
          existingUser.status === "invited" &&
          existingUser.resetTokenExpiry > Date.now()
        ) {
          const resetLink = `${process.env.CLIENT_URL}/set-password/${existingUser.resetToken}`;

          await sendEmail({
        to: email,
        subject: "Set your password – Bidify",
        html: `
          <h3>Hello ${existingUser.name},</h3>
          <p>Your invitation is still valid.</p>
          <a href="${resetLink}">${resetLink}</a>
        `,
      });

      return res.json({
        message: "Invitation re-sent successfully",
      });

        }
    
    //Case3: Expired -> RE-Invite
     
     if (
          existingUser &&
          existingUser.status === "invited" &&
          existingUser.resetTokenExpiry &&
         existingUser.resetTokenExpiry < Date.now()
        ) {
          existingUser.status = "expired";
          await existingUser.save();
        }

    if (existingUser && existingUser.status === "expired") {
      const resetToken = crypto.randomBytes(32).toString("hex");

      existingUser.resetToken = resetToken;
      existingUser.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
      existingUser.status = "invited";
      existingUser.managerId = manager._id;
      existingUser.companyId = manager.companyId;

      await existingUser.save();

      const resetLink = `${process.env.CLIENT_URL}/set-password/${resetToken}`;

      await sendEmail({
        to: email,
        subject: "Set your password – Bidify",
        html: `
          <h3>Hello ${existingUser.name},</h3>
          <p>You have been re-invited to join the company.</p>
          <p>Click below to set your password:</p>
          <a href="${resetLink}" target="_blank">${resetLink}</a>
          <p>This link is valid for 15 minutes.</p>
        `,
      });

      return res.status(200).json({
        message: "Employee re-invited successfully. Password link sent.",
      });
    }

    //Case4: Completely NEW employee

    const resetToken = crypto.randomBytes(32).toString("hex");

    const employee = await User.create({
      name,
      email,
      role: "employee",
      managerId: manager._id,
      companyId: manager.companyId, // ✅ NOW VALID
      isActive: false,
      status:"invited",
      resetToken,
      resetTokenExpiry: Date.now() + 15 * 60 * 1000,
    });

    const resetLink = `${process.env.CLIENT_URL}/employee/set-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Set your password – Bidify",
      html: `
        <h3>Hello ${name},</h3>
        <p>You have been added as an employee.</p>
        <p>Click below to set your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link is valid for 15 minutes.</p>
      `,
    });

    res.status(201).json({
      message: "Employee added successfully. Password setup link sent.",
    });

  } catch (error) {
    console.error("Add Employee Error:", error);
    res.status(500).json({ message: error.message });
  }
};



/* ================= SET EMPLOYEE PASSWORD ================= */
export const setEmployeePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
   if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const employee = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!employee) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    employee.password = await bcrypt.hash(password, 10);
    employee.isActive = true;
    employee.resetToken = undefined;
    employee.status="active";
    employee.isEmailVerified="true";
    employee.resetTokenExpiry = undefined;

    await employee.save();

    res.json({ message: "Password set successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE COMPANY BY ID (FOR VENDOR)
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find(); // 👈 returns EVERYTHING

    res.status(200).json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch companies"
    });
  }
};


/* ================= GET ALL EMPLOYEES OF MANAGER ================= */
export const getMyEmployees = async (req, res) => {
  try {
    const managerId = req.user._id;

    const manager = await User.findById(managerId);

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Only manager can access this" });
    }

    const employees = await User.find({
      managerId: managerId,
      role: "employee",
    })
      .select("name email status isActive createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE COMPANY PROFILE
export const updateCompanyProfile = async (req, res) => {
  try {
    const { address, description, gstNumber, phone, website } = req.body;

    const company = await Company.findOneAndUpdate(
      { createdBy: req.user._id },   // ✅ IMPORTANT FIX
      {
        address,
        description,
        gstNumber,
        website,
        phone,
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET COMPANY PROFILE
export const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ createdBy: req.user._id });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({
      companyName: company.companyName,
      gstNumber: company.gstNumber || "",
      website: company.website || "",
      phone: company.phone || "",
      address: company.address || "",
      description: company.description || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



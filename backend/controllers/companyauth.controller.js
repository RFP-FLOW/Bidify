import User from "../models/UserSchema.js";
import Company  from "../models/company.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

/* ================= REGISTER COMPANY (MANAGER) ================= */
export const registerCompany = async (req, res) => {
  try {
    const { companyName, username, email, password } = req.body;

    if (!companyName || !username || !email || !password ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // if(password!=confirmPassword){
    //   return res.status(400).json({message:"Passwords do not match"});
    // }
    const existingUser = await User.findOne({email});
    
    if (existingUser) {
      console.log("absvj");
      return res
        .status(400)
        .json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const manager=await User.create({
    
      name:username,
      email,
      password: hashedPassword,
      role: "manager",
      isActive: true,
    });
     
    const company = await Company.create({
      companyName,
      createdBy: manager._id,
    });

    manager.companyId = company._id;
    await manager.save();

    res.status(201).json({ message: "Company registered successfully",
      managerId:manager._id,
      companyId:company._id
     });
  } catch (error) {
     if (error.code === 11000) {
    return res.status(400).json({
      message: "User already exists with this email",
    });
  }
    res.status(500).json({ message: error.message });
  }
};

//--------------------Register INIT ...SEND OTP

export const registerInit = async (req, res) => {
  try {
    const { companyName, username, email, password } = req.body;

    if (!companyName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // temporary user
    await User.create({
      name:username,
      email,
      password, // hash later
      role: "manager",
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

//------VERIFY OTP------
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

    user.password = await bcrypt.hash(user.password, 10);
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const company = await Company.create({
      companyName,
      createdBy: user._id,
    });

    user.companyId = company._id;
    await user.save();

    res.json({ message: "Company registered successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId:user.companyId,
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
    const managerId=req.user.id; //coming from auth middleware

    if(!email || !name){
      return res.status(400).json({message: "All fields are required"});
    }

    const existingUser = await User.findOne(
       { email }
    );

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Employee already exists" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const employee = await User.create({
      name,
      email,
      role: "employee",
      managerId,
      isActive: false,
      resetToken,
      resetTokenExpiry: Date.now()+15*60*1000, //15min
    });


    // later: send email with set-password link
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
      message: "Password setup link set to employee email ",
    });
  } catch (error) {
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
    employee.resetTokenExpiry = undefined;

    await employee.save();

    res.json({ message: "Password set successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

///////////////FORGET PASSWORD--------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // 🔐 Security best practice:
    // Always return success even if user not found
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `http://localhost:5173/set-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password – Bidify",
      html: `
        <p>You requested a password reset.</p>
        <p>Click below to set a new password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({
      message: "If the email exists, a reset link has been sent",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


///------------------RESET PASSWORD------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({
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

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


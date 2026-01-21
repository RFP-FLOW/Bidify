import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER COMPANY (MANAGER) ================= */
export const registerCompany = async (req, res) => {
  try {
    const { companyName, username, email, password } = req.body;

    if (!companyName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Company.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Company.create({
      companyName,
      username,
      email,
      password: hashedPassword,
      role: "manager",
      isActive: true,
    });

    res.status(201).json({ message: "Company registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= LOGIN COMPANY ================= */
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Company.findOne({ email });
    if (!user || !user.isActive) {
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
        companyName: user.companyName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= ADD EMPLOYEE (MANAGER ONLY) ================= */
export const addEmployee = async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await Company.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Employee already exists" });
    }

    const employee = await Company.create({
      username,
      email,
      role: "employee",
      isActive: false,
    });

    // later: send email with set-password link
    res.status(201).json({
      message: "Employee added successfully",
      employeeId: employee._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= SET EMPLOYEE PASSWORD ================= */
export const setEmployeePassword = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await Company.findByIdAndUpdate(employeeId, {
      password: hashedPassword,
      isActive: true,
    });

    res.json({ message: "Password set successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

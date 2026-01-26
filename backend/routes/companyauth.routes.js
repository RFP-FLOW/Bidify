import express from "express";
import {
  registerCompany,
  loginCompany,
  addEmployee,
  setEmployeePassword,
  forgotPassword,
  resetPassword,
  verifyOtp,
  registerInit,
  getManagerProfile,
  updateManagerProfile,
} from "../controllers/companyauth.controller.js";


import authMiddleware,{managerOnly} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);

// manager protected routes
router.post("/manager/add-employee", authMiddleware,managerOnly, addEmployee);
router.post("/set-password/:token", setEmployeePassword);
//forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//email verified by otp 
router.post("/register-init", registerInit);
router.post("/verify-otp", verifyOtp);

router.get("/manager/profile", authMiddleware,managerOnly, getManagerProfile);

// UPDATE phone number
router.put("/manager/profile", authMiddleware, managerOnly,updateManagerProfile);
/* GET ALL COMPANIES (FOR VENDORS) */
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const companies = await Company.find().select(
      "companyName industry address description website"
    );

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch companies" });
  }
});
export default router;

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
  updateCompanyProfile,
  getAllCompanies,
} from "../controllers/companyauth.controller.js";


import authMiddleware,{managerOnly,vendorOnly} from "../middlewares/auth.middleware.js";

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

router.get("/get-AllCompany",authMiddleware,vendorOnly,getAllCompanies);


export default router;

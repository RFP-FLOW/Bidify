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
  getCompanyById,
  getMyEmployees,
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
router.get("/manager/employees",authMiddleware,managerOnly,getMyEmployees);

// UPDATE phone number
router.put("/manager/profile", authMiddleware, managerOnly,updateManagerProfile);

router.get("/get-AllCompany",authMiddleware,vendorOnly,getAllCompanies);
router.get("/:id", authMiddleware, getCompanyById);

export default router;

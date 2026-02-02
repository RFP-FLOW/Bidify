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
  getAllCompanies,
  getCompanyById,
  getMyEmployees,
  getCompanyProfile,
  updateCompanyProfile,
  resendOtp,
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
router.post("/resend-otp", resendOtp);


router.get("/manager/employees",authMiddleware,managerOnly,getMyEmployees);
router.put("/profile", authMiddleware, managerOnly, updateCompanyProfile);

router.get("/profile",authMiddleware,managerOnly,getCompanyProfile);

router.get("/get-AllCompany",authMiddleware,vendorOnly,getAllCompanies);
router.get("/:id", authMiddleware, getCompanyById);

export default router;

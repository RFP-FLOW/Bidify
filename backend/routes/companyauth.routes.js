import express from "express";
import {
  registerCompany,
  loginCompany,
  addEmployee,
  setEmployeePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/companyauth.controller.js";


import authMiddleware,{managerOnly} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);

// manager protected routes
router.post("/manager/add-employee", authMiddleware,managerOnly, addEmployee);
router.post("/set-password/:token", setEmployeePassword);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

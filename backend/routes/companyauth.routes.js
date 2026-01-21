import express from "express";
import {
  registerCompany,
  loginCompany,
  addEmployee,
  setEmployeePassword,
} from "../controllers/companyauth.controller.js";


import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);

// manager protected routes
router.post("/add-employee", authMiddleware, addEmployee);
router.post("/set-password/:employeeId", setEmployeePassword);

export default router;

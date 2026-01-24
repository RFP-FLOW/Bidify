import express from "express";
import {
  registerCompany,
  loginCompany,
  addEmployee,
  setEmployeePassword,
} from "../controllers/companyauth.controller.js";


import authMiddleware,{managerOnly} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);

// manager protected routes
router.post("/manager/add-employee", authMiddleware,managerOnly, addEmployee);
router.post("/set-password/:token", setEmployeePassword);

export default router;

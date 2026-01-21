import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/vendor-dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to Vendor Dashboard",
    user: req.user,
  });
});

export default router;

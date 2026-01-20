import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
connectDB();

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});

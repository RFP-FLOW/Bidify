import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/vendorauth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import companyauthRoutes from "./routes/companyauth.routes.js"; 
import rfpRoutes from "./routes/rfpRoutes.js"; 
;

dotenv.config();

const app = express();

// DB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/company", companyauthRoutes);
app.use("/api/rfp", rfpRoutes);
  
// Test route
app.get("/", (req, res) => {
  res.send("Bidify API running");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});

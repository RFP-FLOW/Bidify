import fetch, { Headers, Request, Response } from "node-fetch";

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import vendorauthRoutes  from "./routes/vendorauth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import companyauthRoutes from "./routes/companyauth.routes.js"; 
import rfpRoutes from "./routes/rfpRoutes.js"; 
import managerVendor from "./routes/managerVendor.routes.js"


dotenv.config();
console.log("GEMINI_API_KEY =", process.env.GEMINI_API_KEY);
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
app.use("/api/auth", vendorauthRoutes );
app.use("/api/protected", protectedRoutes);
app.use("/api/company", companyauthRoutes);
app.use("/api/rfp", rfpRoutes);
app.use("/api/vendor", vendorauthRoutes);
app.use("/api/manager-vendor",managerVendor);
  
// Test route
app.get("/", (req, res) => {
  res.send("Bidify API running");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});

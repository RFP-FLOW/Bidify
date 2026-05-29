import express from "express";
import {
  createRFP,
  getEmployeeRFPs,
  getRFPStats,
  getRFPById,
  sendRFPToVendors,
  updateRFP,
  getEmployeeBids,
  forwardToManager,
  getForwardedRFPs,
  getConfirmedRFPs,
  getManagerStats,
} from "../controllers/rfpController.js";
import { generateRFP } from "../controllers/aiRfp.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getRfpProposals } from "../controllers/vendorRfp.controller.js";
import { approveProposal } from "../controllers/vendorReply.controller.js";

const router = express.Router();

// ============================================================
// ⚠️  IMPORTANT: Express routes top-to-bottom match hoti hain
// Static routes (jaise /stats, /confirmed) hamesha
// Dynamic routes (jaise /:id) se UPAR rakhni chahiye
// Warna Express /:id ko pehle match kar leta hai
// ============================================================


// -----------------------------------------------------------
// 🤖 AI - RFP Auto Generate
// POST /api/rfp/generate
// Employee AI se RFP draft banata hai
// -----------------------------------------------------------
router.post("/generate", authMiddleware, generateRFP);


// -----------------------------------------------------------
// 📊 DASHBOARD STATS
// GET /api/rfp/stats
// Employee ke DRAFT, SENT, FORWARDED RFPs ka count return karta hai
// -----------------------------------------------------------
router.get("/stats", authMiddleware, getRFPStats);


// -----------------------------------------------------------
// 📋 EMPLOYEE KE SAARE RFPs
// GET /api/rfp/employee
// Logged-in employee ne jo bhi RFPs banaye hain wo sab
// -----------------------------------------------------------
router.get("/employee", authMiddleware, getEmployeeRFPs);


// -----------------------------------------------------------
// 💰 EMPLOYEE BIDS PAGE
// GET /api/rfp/bids
// SENT RFPs + har RFP pe kitne bids aaye - paginated
// -----------------------------------------------------------
router.get("/bids", authMiddleware, getEmployeeBids);


// -----------------------------------------------------------
// 📨 MANAGER KE FORWARDED RFPs (Manager Dashboard ke liye)
// GET /api/rfp/forwarded
// Manager ke under jo employees hain unke FORWARDED RFPs
// -----------------------------------------------------------
router.get("/forwarded", authMiddleware, getForwardedRFPs);


// -----------------------------------------------------------
// ✅ CONFIRMED / APPROVED RFPs
// GET /api/rfp/confirmed
// Jis RFP ka proposal ACCEPTED ho gaya wo sab
// ⚠️ ZAROORI: Ye route /:id se UPAR hona chahiye
//    warna Express "confirmed" ko ek ID samajh leta hai
// -----------------------------------------------------------
router.get("/confirmed", authMiddleware, getConfirmedRFPs);


// -----------------------------------------------------------
// ✍️  RFP BANANA (DRAFT)
// POST /api/rfp
// Employee naya RFP create karta hai - status: DRAFT
// -----------------------------------------------------------
router.post("/", authMiddleware, createRFP);


// -----------------------------------------------------------
// 📊 MANAGER DASHBOARD STATS
// GET /api/rfp/manager-stats
// Manager ke dashboard ke liye real stats
// -----------------------------------------------------------
router.get("/manager-stats", authMiddleware, getManagerStats);


// -----------------------------------------------------------
// ✏️  RFP UPDATE KARO (sirf DRAFT edit ho sakta hai)
// PUT /api/rfp/:id
// -----------------------------------------------------------
router.put("/:id", authMiddleware, updateRFP);


// -----------------------------------------------------------
// 📬 RFP KE SAARE VENDOR PROPOSALS
// GET /api/rfp/:rfpId/proposals
// Ek specific RFP pe vendors ne jo proposals diye
// -----------------------------------------------------------
router.get("/:rfpId/proposals", authMiddleware, getRfpProposals);


// -----------------------------------------------------------
// 🚀 RFP VENDORS KO BHEJO
// POST /api/rfp/:rfpId/send
// RFP select vendors ko email ke saath bhej deta hai
// RFP status: DRAFT → SENT
// -----------------------------------------------------------
router.post("/:rfpId/send", authMiddleware, sendRFPToVendors);


// -----------------------------------------------------------
// 📤 MANAGER KO FORWARD KARO
// POST /api/rfp/:rfpId/forward-to-manager
// Employee AI recommendations ke saath manager ko email bhejta hai
// RFP status: SENT → FORWARDED
// -----------------------------------------------------------
router.post("/:rfpId/forward-to-manager", authMiddleware, forwardToManager);


// -----------------------------------------------------------
// ✔️  PROPOSAL APPROVE KARO (Manager)
// PATCH /api/rfp/proposal/approve/:proposalId
// Manager ek vendor ka proposal accept karta hai
// ⚠️ NOTE: Ye bhi /:id se pehle hai - "proposal" dynamic match na ho
// -----------------------------------------------------------
router.patch("/proposal/approve/:proposalId", authMiddleware, approveProposal);


// -----------------------------------------------------------
// 🔍 SINGLE RFP DETAIL
// GET /api/rfp/:id
// ⚠️ HAMESHA LAST MEIN RAKHO - dynamic route hai
//    upar ke saare static routes match hone ke baad hi
//    yahan aana chahiye
// -----------------------------------------------------------
router.get("/:id", authMiddleware, getRFPById);


export default router;
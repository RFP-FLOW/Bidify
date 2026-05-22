# Bidify-RFP 🚀  
### AI-Powered Request For Proposal (RFP) Management Platform

Bidify-RFP is a full-stack MERN application that streamlines the procurement and vendor proposal workflow for companies. The platform enables employees to create RFPs, send them to vendors, collect proposals, analyze them using AI, and forward the best recommendations to managers for approval.

---

# ✨ Features

## 👨‍💼 Employee Module
- Create and manage RFPs
- AI-generated RFP structure using Gemini AI
- Send RFPs to selected vendors
- View vendor proposals
- Compare vendor quotations
- Forward top AI recommendations to manager
- Track proposal statuses

---

## 🏢 Vendor Module
- Vendor registration with GST verification
- OTP-based email verification
- View open RFPs
- Submit proposals with attachments
- Upload PDF/DOCX proposal files
- Real-time proposal tracking
- Profile management

---

## 👨‍💻 Manager Module
- View forwarded RFPs
- AI-powered vendor comparison
- Approve/reject vendor proposals
- View proposal attachments
- Finalize procurement decisions

---

# 🤖 AI Features
- AI-generated RFP creation
- AI-based vendor recommendation system
- Proposal comparison using Gemini/OpenRouter
- Cost and delivery analysis
- Smart recommendation ranking

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM
- React Toastify
- Lucide React Icons

---

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Refresh Token Authentication

---

## AI & APIs
- Google Gemini API
- OpenRouter API

---

## File Handling
- Cloudinary
- Multer
- PDF Parsing
- DOCX Parsing

---

## Email Services
- Nodemailer
- Gmail SMTP

---

# 📂 Project Structure

```bash
Bidify-RFP/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│
└── README.md
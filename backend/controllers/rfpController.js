import RFP from "../models/RFP.js";
import Proposal from "../models/Proposal.js";
import Vendor from "../models/Vendor.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/UserSchema.js";

/**
 * @desc    Create a new RFP (DRAFT)
 * @route   POST /api/rfp
 * @access  Employee
 */
export const createRFP = async (req, res) => {
  try {
    const { title, description, items } = req.body;

    // basic validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const rfp = await RFP.create({
      title,
      description,
      items,
      createdBy: req.user._id, // comes from auth middleware
      companyId: req.user.companyId,
      status: "DRAFT",
    });

    res.status(201).json({
      message: "RFP created successfully",
      rfp,
    });
  } catch (error) {
    console.error("Create RFP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all RFPs created by logged-in employee
 * @route   GET /api/rfp/employee
 * @access  Employee
 */
export const getEmployeeRFPs = async (req, res) => {
  try {
    const rfps = await RFP.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(rfps);
  } catch (error) {
    console.error("Get Employee RFPs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get dashboard stats for employee
 * @route   GET /api/rfp/stats
 * @access  Employee
 */
export const getRFPStats = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const [draft, sent, forwarded] = await Promise.all([
      RFP.countDocuments({ createdBy: employeeId, status: "DRAFT" }),
      RFP.countDocuments({ createdBy: employeeId, status: "SENT" }),
      RFP.countDocuments({ createdBy: employeeId, status: "FORWARDED" }),
    ]);

    res.status(200).json({
      draft,
      sent,
      forwarded,
    });
  } catch (error) {
    console.error("Get RFP Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRFPById = async (req, res) => {
  try {
    const { id } = req.params;

    const rfp = await RFP.findOne({
  _id: req.params.id,
  createdBy: req.user._id,
})
.populate("sentToVendors", "name email");

    if (!rfp) {
      return res.status(404).json({
        message: "RFP not found or access denied",
      });
    }

    res.status(200).json(rfp);
  } catch (error) {
    console.error("Get RFP By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const sendRFPToVendors = async (req, res) => {
  try {
    if (!req.user || !req.user.companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rfpId } = req.params;
    const { vendorIds } = req.body;

    if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({
        message: "Please select at least one vendor",
      });
    }

    const rfp = await RFP.findById(rfpId);

    if (!rfp) {
      return res.status(404).json({ message: "RFP not found" });
    }

    if (rfp.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({
        message: "Not allowed to send this RFP",
      });
    }

    // ✅ UPDATE RFP STATUS & TARGET VENDORS
    rfp.status = "SENT";
    rfp.sentToVendors = vendorIds;
    await rfp.save();

    // 📧 FETCH VENDORS
    const vendors = await Vendor.find({
      _id: { $in: vendorIds },
    });

    // 📧 SEND EMAILS (SAFE LOOP)
    for (const vendor of vendors) {
      if (!vendor.email) continue;

      try {
        await sendEmail({
          to: vendor.email,
          subject: `New RFP Received – ${rfp.title}`,
          replyTo: req.user.email,
          html: `
            <h2>Hello ${vendor.name},</h2>

            <p>You have received a new <strong>Request for Proposal</strong>.</p>

            <p><strong>Title:</strong> ${rfp.title}</p>
            <p><strong>Description:</strong> ${rfp.description}</p>

            <p>Please login to Bidify to submit your proposal.</p>

            <br/>
            <p>— Team Bidify</p>
          `,
        });
      } catch (mailErr) {
        console.error(
          "Email failed for vendor:",
          vendor._id,
          mailErr.message
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "RFP sent to vendors successfully",
    });
  } catch (error) {
    console.error("Send RFP Error:", error);
    res.status(500).json({
      message: "Server error while sending RFP",
    });
  }
};


export const updateRFP = async (req, res) => {
  try {
    const { title, description, items } = req.body;

    const rfp = await RFP.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
        status: "DRAFT", // 🔒 only draft editable
      },
      { title, description, items },
      { new: true }
    );

    if (!rfp) {
      return res.status(404).json({
        message: "Draft RFP not found or not editable",
      });
    }

    res.json({
      message: "Draft updated successfully",
      rfp,
    });
  } catch (error) {
    console.error("Update RFP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Get SENT RFPs with proposal (bid) count for employee
 * @route   GET /api/rfp/bids
 * @access  Employee
 */
export const getEmployeeBids = async (req, res) => {
  try {
    //  console.log("BIDS API HIT");
    // console.log("USER ID:", req.user._id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // 1️⃣ Only SENT RFPs created by logged-in employee
    const rfps = await RFP.find({
      createdBy: req.user._id,
      status: "SENT",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RFP.countDocuments({
      createdBy: req.user._id,
      status: "SENT",
    });

    // 2️⃣ Get proposal count per RFP (aggregation)
    const rfpIds = rfps.map((r) => r._id);

    const proposalCounts = await Proposal.aggregate([
      { $match: { rfpId: { $in: rfpIds } } },
      { $group: { _id: "$rfpId", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    proposalCounts.forEach((p) => {
      countMap[p._id.toString()] = p.count;
    });

    // 3️⃣ Attach bidCount to each RFP
    const result = rfps.map((rfp) => ({
      ...rfp.toObject(),
      bidCount: countMap[rfp._id.toString()] || 0,
    }));

    res.status(200).json({
      rfps: result,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Employee Bids Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all vendor proposals for a specific RFP (employee)
 * @route   GET /api/rfp/:rfpId/proposals
 * @access  Employee
 */
export const getRfpProposals = async (req, res) => {
  try {
    const { rfpId } = req.params;

    const proposals = await Proposal.find({ rfpId })
      .populate("vendorId", "name email businessName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rfpTitle: proposals[0]?.rfpId?.title,
      proposals,
    });
  } catch (error) {
    console.error("GET RFP PROPOSALS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch proposals",
    });
  }
};

export const forwardToManager = async (req, res) => {
  try {
    const { rfpId } = req.params;
    const { note, aiResult, rfpTitle } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ message: "Note to manager is required" });
    }

    if (!aiResult || !aiResult.topRecommendations?.length) {
      return res
        .status(400)
        .json({ message: "AI recommendations are required" });
    }

    // Find the manager: employee's managerId field points to the manager User
    const employee = await User.findById(req.user._id).populate(
      "managerId",
      "name email"
    );

    if (!employee?.managerId?.email) {
      return res
        .status(404)
        .json({ message: "Manager not found for this employee" });
    }

    const manager = employee.managerId;
    const top3 = aiResult.topRecommendations.slice(0, 3);

    // Build the analysis map for quick lookup
    const analysisMap = {};
    aiResult.vendorsAnalysis?.forEach((v) => {
      analysisMap[v.vendor] = v;
    });

    // Build vendor rows HTML
    const vendorRows = top3
      .map((vendor, index) => {
        const analysis = analysisMap[vendor.vendor] || {};
        const rankColors = ["#22c55e", "#3b82f6", "#f97316"];
        const rankColor = rankColors[index] || "#6b7280";

        const itemBreakdownHtml =
          analysis.itemBreakdown?.length > 0
            ? `<div style="margin-top:8px;">
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">Item Breakdown</p>
                ${analysis.itemBreakdown
                  .map(
                    (item) =>
                      `<span style="display:inline-block;background:#f3e8ff;color:#7c3aed;font-size:11px;padding:2px 8px;border-radius:20px;margin:2px;">
                        ${item.item} — ₹${Number(item.totalItemPrice).toLocaleString("en-IN")}
                      </span>`
                  )
                  .join("")}
              </div>`
            : "";

        const reasonHtml = analysis.reason
          ? `<div style="margin-top:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 10px;font-size:12px;color:#92400e;">
              💡 ${analysis.reason}
            </div>`
          : "";

        const deliveryHtml =
          analysis.deliveryDays || analysis.deliveryCharge !== undefined
            ? `<div style="display:flex;gap:12px;margin-top:10px;">
                ${
                  analysis.deliveryDays
                    ? `<div style="background:#f9fafb;border-radius:6px;padding:6px 12px;flex:1;">
                        <p style="margin:0;font-size:11px;color:#9ca3af;">Delivery Time</p>
                        <p style="margin:0;font-weight:600;color:#374151;">${analysis.deliveryDays} days</p>
                      </div>`
                    : ""
                }
                ${
                  analysis.deliveryCharge !== undefined
                    ? `<div style="background:#f9fafb;border-radius:6px;padding:6px 12px;flex:1;">
                        <p style="margin:0;font-size:11px;color:#9ca3af;">Delivery Charge</p>
                        <p style="margin:0;font-weight:600;color:#374151;">₹${Number(analysis.deliveryCharge).toLocaleString("en-IN")}</p>
                      </div>`
                    : ""
                }
              </div>`
            : "";

        return `
          <div style="background:#ffffff;border-radius:12px;padding:18px;margin-bottom:14px;border-left:4px solid ${rankColor};box-shadow:0 1px 4px rgba(0,0,0,0.06);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:30px;height:30px;border-radius:50%;background:${rankColor};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0;">#${index + 1}</div>
                <div>
                  <p style="margin:0;font-weight:700;font-size:15px;color:#1f2937;">${vendor.vendor}</p>
                  <p style="margin:0;font-size:12px;color:#6b7280;">${vendor.email}</p>
                </div>
              </div>
              <p style="margin:0;font-weight:700;font-size:16px;color:#16a34a;">₹${Number(vendor.grandTotal).toLocaleString("en-IN")}</p>
            </div>
            ${deliveryHtml}
            ${itemBreakdownHtml}
            ${reasonHtml}
          </div>
        `;
      })
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f6f7fb;font-family:'Segoe UI',Arial,sans-serif;">
          <div style="max-width:620px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#7c3aed,#9333ea);padding:28px 32px;">
              <p style="margin:0;font-size:12px;color:#e9d5ff;letter-spacing:1px;text-transform:uppercase;">Bidify · RFP Management</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">Vendor Shortlist for Your Review</h1>
            </div>

            <!-- Body -->
            <div style="padding:28px 32px;">

              <p style="color:#374151;font-size:15px;margin:0 0 6px;">Hi ${manager.name},</p>
              <p style="color:#6b7280;font-size:14px;margin:0 0 20px;">
                <strong style="color:#374151;">${employee.name}</strong> has reviewed vendor proposals for the RFP 
                <strong style="color:#7c3aed;">"${rfpTitle}"</strong> using AI analysis and is forwarding the top recommendations for your approval.
              </p>

              <!-- Employee's Note -->
              <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:16px 18px;margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:12px;color:#7c3aed;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">📝 Note from ${employee.name}</p>
                <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">${note}</p>
              </div>

              <!-- Top Vendors -->
              <p style="font-size:14px;font-weight:700;color:#1f2937;margin:0 0 12px;">🏆 Top ${top3.length} Recommended Vendors</p>
              ${vendorRows}

              <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
                This recommendation was generated by Bidify's AI engine based on price, delivery time, and overall value. Please log in to Bidify to view the full proposals.
              </p>
            </div>

            <!-- Footer -->
            <div style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:16px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#d1d5db;">© ${new Date().getFullYear()} Bidify · Automated RFP Management</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: manager.email,
      subject: `[Action Required] Vendor Shortlist for "${rfpTitle}" — Forwarded by ${employee.name}`,
      html,
      replyTo: employee.email,
    });

    // Mark RFP as FORWARDED
    await RFP.findByIdAndUpdate(rfpId, { status: "FORWARDED" });

   res.status(200).json({
  success: true,
  message: `Email sent to manager ${manager.name}`,
  managerEmail: manager.email,
  managerName: manager.name,
});
  } catch (error) {
    console.error("Forward to Manager Error:", error);
    res.status(500).json({ message: "Failed to forward to manager" });
  }
};

export const getForwardedRFPs = async (req, res) => {
  try {
    // Step 1: Manager ke saare employees dhundho
    const employees = await User.find({
      managerId: req.user._id,
      role: "employee",
    }).select("_id");

    const employeeIds = employees.map((e) => e._id);

    // Step 2: In employees ke FORWARDED RFPs fetch karo
    const rfps = await RFP.find({
      createdBy: { $in: employeeIds },
      status: "FORWARDED",
    })
      .populate("createdBy", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, rfps });
  } catch (error) {
    console.error("getForwardedRFPs error:", error);
    res.status(500).json({ message: "Failed to fetch forwarded RFPs" });
  }
};






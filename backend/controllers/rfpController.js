import RFP from "../models/RFP.js";
import Proposal from "../models/Proposal.js";
import Vendor from "../models/Vendor.js";
import sendEmail from "../utils/sendEmail.js";

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



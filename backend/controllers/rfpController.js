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
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { rfpId } = req.params;
    const { vendorIds } = req.body;

    if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({
        message: "Please select at least one vendor",
      });
    }

    // 🔍 Find RFP
    const rfp = await RFP.findById(rfpId);

    if (!rfp) {
      return res.status(404).json({ message: "RFP not found" });
    }

    if (rfp.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({
        message: "Not allowed to send this RFP",
      });
    }

    // 🔁 CREATE PROPOSALS (🔥 MAIN LOGIC)
    const proposals = vendorIds.map((vendorId) => ({
      vendorId,
      rfpId,
      status: "PENDING",
    }));

    await Proposal.insertMany(proposals);

    // 🔄 Update RFP
    rfp.status = "SENT";
    rfp.sentToVendors = vendorIds;
    await rfp.save();

    // 📧 Fetch vendor details
const vendors = await Vendor.find({
  _id: { $in: vendorIds },
});

// 📧 Send email to each vendor
for (const vendor of vendors) {
  await sendEmail({
  to: vendor.email,
  subject: `New RFP Received – ${rfp.title}`,
  replyTo: req.user.email, // 🔥 EMPLOYEE EMAIL
  html: `
    <h2>Hello ${vendor.name},</h2>

    <p>You have received a new <strong>Request for Proposal</strong>.</p>

    <p><strong>Title:</strong> ${rfp.title}</p>
    <p><strong>Description:</strong> ${rfp.description}</p>

    <p>
      You can directly reply to this email with your proposal.
    </p>

    <br/>
    <p>— Team Bidify</p>
  `,
});
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



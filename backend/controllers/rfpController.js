import RFP from "../models/RFP.js";

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
}).lean();

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
        message: "Unauthorized: user/company missing",
      });
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

    rfp.status = "SENT";
    rfp.sentToVendors = vendorIds;
    await rfp.save();

    res.status(200).json({
      success: true,
      message: "RFP sent to vendors successfully",
      rfp,
    });
  } catch (error) {
    console.error("Send RFP Error:", error);
    res.status(500).json({
      message: "Server error while sending RFP",
    });
  }
};


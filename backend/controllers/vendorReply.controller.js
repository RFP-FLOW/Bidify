import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";
import Vendor from "../models/Vendor.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * @desc    Create or update vendor reply to an RFP (Platform reply)
 * @route   POST /api/vendor-reply/replies
 * @access  Vendor
 */
export const submitVendorReply = async (req, res) => {
  try {
    // 🔐 Auth middleware injects vendor
    const vendorId = req.user?._id;
    const { rfpId, message, quotedPrice } = req.body;

    /* ----------------------- Basic validation ----------------------- */
    if (!vendorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized vendor",
      });
    }

    if (!rfpId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "RFP ID and message are required",
      });
    }

    /* ----------------------- Verify RFP ----------------------------- */
    const rfp = await RFP.findById(rfpId).populate(
      "createdBy",
      "name email"
    );

    if (!rfp) {
      return res.status(404).json({
        success: false,
        message: "RFP not found",
      });
    }

    /* ----------------------- Verify Vendor -------------------------- */
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    /* ---------------- Create or Update Proposal --------------------- */
    const proposal = await Proposal.findOneAndUpdate(
      { vendorId, rfpId },
      {
        vendorId,
        rfpId,
        message: message.trim(),
        quotedPrice: quotedPrice ? Number(quotedPrice) : undefined,
        replyMode: "PLATFORM",
        status: "PENDING",
        repliedAt: new Date(),
        employeeNotified: true,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    /* ----------------------- Email Notification --------------------- */
    try {
      console.log("📧 EMAIL DEBUG START");
console.log("➡️ Employee Name:", rfp.createdBy?.name);
console.log("➡️ Employee Email:", rfp.createdBy?.email);
console.log("➡️ Vendor Name:", vendor.businessName || vendor.name);
console.log("➡️ From EMAIL_USER:", process.env.EMAIL_USER);

      await sendEmail({
        to: rfp.createdBy.email,
        subject: `New vendor reply for RFP: ${rfp.title}`,
        html: `
          <h3>Hello ${rfp.createdBy.name},</h3>

          <p>A vendor has submitted a reply to your RFP.</p>

          <p><strong>Vendor:</strong> ${
            vendor.businessName || vendor.name
          }</p>

          <p><strong>RFP:</strong> ${rfp.title}</p>

          <p><strong>Message:</strong></p>
          <blockquote>${message}</blockquote>

          ${
            quotedPrice
              ? `<p><strong>Quoted Price:</strong> ₹${quotedPrice}</p>`
              : ""
          }

          <br/>
          <p>— Team Bidify</p>
        `,
      });
    } catch (emailError) {
      console.error("❌ EMAIL FULL ERROR:", emailError);
      // Email failure should not break main flow
    }

    /* ----------------------- Final Response ------------------------- */
    return res.status(201).json({
      success: true,
      message: "Vendor reply submitted successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("SUBMIT VENDOR REPLY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit vendor reply",
    });
  }
};

export const getOpenRFPsForVendor = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const rfps = await RFP.find({
      status: "SENT",                 // 👈 company ne send ki ho
      sentToVendors: vendorId,        // 👈 is vendor ko hi send hui ho
    })
      .populate("companyId", "companyName")
      .lean();

    res.status(200).json({
      success: true,
      data: rfps,
    });
  } catch (error) {
    console.error("GET OPEN RFPS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch open RFPs",
    });
  }
};



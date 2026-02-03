import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";
import Vendor from "../models/Vendor.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * @desc    Vendor replies to an RFP (Platform reply)
 * @route   POST /api/vendor/reply
 * @access  Vendor
 */
export const submitVendorReply = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const { rfpId, message, quotedPrice } = req.body;

    if (!rfpId || !message) {
      return res.status(400).json({
        success: false,
        message: "RFP ID and message are required",
      });
    }

    // 🔍 Check RFP exists
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

    // 🔍 Check vendor exists
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ❌ Prevent duplicate replies
    const existingReply = await Proposal.findOne({
      vendorId,
      rfpId,
    });

    if (existingReply) {
      return res.status(400).json({
        success: false,
        message: "You have already replied to this RFP",
      });
    }

    // ✅ Save proposal (reply)
    const proposal = await Proposal.create({
      vendorId,
      rfpId,
      message,
      quotedPrice: quotedPrice ? Number(quotedPrice) : undefined,
      replyMode: "PLATFORM",
      status: "PENDING",
      employeeNotified: true,
      repliedAt: new Date(),
    });

    // 📧 Send email to employee
try {
  await sendEmail({
    to: rfp.createdBy.email,
    subject: `New reply received for RFP: ${rfp.title}`,
    html: `
      <h3>Hello ${rfp.createdBy.name},</h3>

      <p>You have received a new reply from a vendor.</p>

      <p><strong>Vendor:</strong> ${vendor.businessName || vendor.name}</p>
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

  console.log("✅ EMAIL SENT TO:", rfp.createdBy.email);

} catch (emailError) {
  console.error("❌ EMAIL FAILED:", emailError.message);
}


    res.status(201).json({
      success: true,
      message: "Reply submitted successfully and email sent",
      data: proposal,
    });
  } catch (error) {
    console.error("SUBMIT VENDOR REPLY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit reply",
    });
  }
};

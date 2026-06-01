import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";
import Vendor from "../models/Vendor.js";
import sendEmail from "../utils/sendEmail.js";
import { parseFile } from "../utils/fileParser.js";

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
    const rfp = await RFP.findById(rfpId).populate("createdBy", "name email");

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
    const attachment = req.file ? req.file.path : null;

// 🔥 Parse file if uploaded
let parsedData = { total: 0, deliveryDays: 0 };

if (attachment) {
  parsedData = await parseFile(attachment);
}

    const proposal = await Proposal.findOneAndUpdate(
      { vendorId, rfpId },
      {
        vendorId,
        rfpId,
        message: message.trim(),
quotedPrice: quotedPrice
  ? Number(quotedPrice)
  : parsedData.total || undefined,

deliveryDays: parsedData.deliveryDays || undefined,
        replyMode: "PLATFORM",
        status: "PENDING",
        repliedAt: new Date(),
        employeeNotified: true,
        attachment,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
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
        replyTo: req.user.email, // 👈 employee email
        html: `
          <h3>Hello ${rfp.createdBy.name},</h3>

          <p>A vendor has submitted a reply to your RFP.</p>

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

export const getVendorOpenRFPs = async (
  req,
  res
) => {
  try {
    const vendorId = req.user._id;

    // ALL OPEN RFPS
    const rfps = await RFP.find({
      status: "SENT",
      sentToVendors: vendorId,
    })
      .populate(
        "companyId",
        "companyName"
      )
      .lean();

    // VENDOR PROPOSALS
    const proposals =
      await Proposal.find({
        vendorId,
      }).select("rfpId");

    // replied rfp ids
    const repliedRfpIds =
      proposals.map((p) =>
        p.rfpId.toString()
      );

    // ADD FLAG
    const updatedRfps = rfps.map(
      (rfp) => ({
        ...rfp,

        hasVendorReplied:
          repliedRfpIds.includes(
            rfp._id.toString()
          ),
      })
    );

    res.status(200).json({
      success: true,
      data: updatedRfps,
    });

  } catch (error) {
    console.error(
      "GET OPEN RFPS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch open RFPs",
    });
  }
};



export const approveProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await Proposal.findById(proposalId)
      .populate("vendorId")
      .populate("rfpId","title companyId");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    // ✅ Security check
    if (proposal.rfpId.companyId.toString() !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    // 🔴 IMPORTANT: reject all other proposals of same RFP
    await Proposal.updateMany(
      { rfpId: proposal.rfpId, _id: { $ne: proposalId } },
      { status: "REJECTED" }
    );

    // ✅ approve selected
    proposal.status = "ACCEPTED";
    await proposal.save();

    // ✅ Email
  await sendEmail({
  to: proposal.vendorId.email,
  subject: "Your Proposal has been Approved 🎉",

  html: `
    <h2>🎉 Proposal Approved</h2>

    <p>Hello <b>${proposal.vendorId.name || "Vendor"}</b>,</p>

    <p>Your proposal has been <b style="color:green;">APPROVED</b>.</p>

    <hr/>

    <p><b>RFP ID:</b> ${proposal.rfpId._id}</p>
    <p><b>RFP Title:</b> ${proposal.rfpId.title}</p>
    <p><b>Quoted Price:</b> ₹${proposal.quotedPrice}</p>
    <p><b>Delivery Days:</b> ${proposal.deliveryDays}</p>

    <p><b>Your Message:</b></p>
    <blockquote>${proposal.message}</blockquote>

    <br/>
    <p>Regards,<br/>Bidify Team</p>
  `,
});
    res.status(200).json({
      success: true,
      message: "Proposal approved successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* -------- GET APPROVED PROPOSALS (VENDOR) -------- */
export const getApprovedProposals = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const proposals = await Proposal.find({
      vendorId,
      status: "ACCEPTED",
    })
      .populate("rfpId", "title description")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyProposals = async (
  req,
  res
) => {
  try {
    const proposals = await Proposal.find({
      vendorId: req.user.id,
    })
      .populate({
        path: "rfpId",
        populate: { path: "companyId", select: "companyName" },
      })
      .populate("vendorId");

    res.status(200).json({
      success: true,
      data: proposals,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch proposals",
    });
  }
};
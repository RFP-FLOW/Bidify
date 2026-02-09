import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
 await transporter.verify();
    await transporter.sendMail({
      from: `"Bidify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.EMAIL_USER,
    });

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

export default sendEmail;

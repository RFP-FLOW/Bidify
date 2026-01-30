import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, replyTo }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
  from: `"Bidify" <${process.env.EMAIL_USER}>`,
  to,
  subject,
  html,
  replyTo: replyTo || process.env.EMAIL_USER,
});
};

export default sendEmail;

import nodemailer from "nodemailer";

export const sendGmailNotification = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // set in .env
      pass: process.env.GMAIL_PASS, // set in .env
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

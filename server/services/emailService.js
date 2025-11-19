import nodemailer from "nodemailer";
import { gmailConfig } from "../config/emailConfig.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailConfig.user,
    pass: gmailConfig.pass,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: gmailConfig.user,
    to,
    subject,
    html,
    text,
  };
  return transporter.sendMail(mailOptions);
};

// 1. Admin: New Service Request Notification
export const sendAdminNewServiceRequestEmail = async ({
  serviceName,
  description,
  preferredDate,
  location,
  budget,
  propertyType,
  timeline,
  customerDetails,
  provider,
  to, // optional, for testing or override
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || gmailConfig.user;
  const recipient = to || adminEmail;
  const subject = `New Service Request Registered: ${serviceName}`;
  const html = `
    <h2>New Service Request Registered</h2>
    <p><b>Service:</b> ${serviceName}</p>
    <p><b>Description:</b> ${description}</p>
    <p><b>Preferred Date:</b> ${
      preferredDate ? new Date(preferredDate).toLocaleString() : "N/A"
    }</p>
    <p><b>Location:</b> ${location}</p>
    <p><b>Budget:</b> ${budget || "N/A"}</p>
    <p><b>Property Type:</b> ${propertyType || "N/A"}</p>
    <p><b>Timeline:</b> ${timeline || "N/A"}</p>
    <h3>Customer Details</h3>
    <ul>
      <li><b>Name:</b> ${customerDetails?.name}</li>
      <li><b>Email:</b> ${customerDetails?.email}</li>
      <li><b>Phone:</b> ${customerDetails?.phone}</li>
      <li><b>Address:</b> ${customerDetails?.address}</li>
    </ul>
    <h3>Provider</h3>
    <ul>
      <li><b>Provider Name:</b> ${
        provider?.providerProfile?.companyName ||
        provider?.userProfile?.fullName ||
        "N/A"
      }</li>
      <li><b>Provider Email:</b> ${
        provider?.providerProfile?.providerEmail || provider?.email || "N/A"
      }</li>
    </ul>
    <p>This is an automated notification from Home Services Hub.</p>
  `;
  return sendEmail({ to: recipient, subject, html });
};

// 2. Customer: Service Request Status Notification (requested, completed, rejected, cancelled)
export const sendCustomerServiceRequestStatusEmail = async ({
  status, // 'requested', 'completed', 'rejected', 'cancelled'
  customerEmail,
  serviceName,
  providerName,
  description,
  preferredDate,
  location,
  budget,
  propertyType,
  timeline,
}) => {
  let subject = "";
  let html = "";

  switch (status) {
    case "requested":
      subject = `Service Request Submitted: ${serviceName}`;
      html = `
        <p>Dear Customer,</p>
        <p>Your service request for <b>${serviceName}</b> has been successfully submitted.</p>
        <p>Provider: <b>${providerName || "N/A"}</b></p>
        <p>Description: ${description || "N/A"}</p>
        <p>Preferred Date: ${
          preferredDate ? new Date(preferredDate).toLocaleString() : "N/A"
        }</p>
        <p>Location: ${location || "N/A"}</p>
        <p>Budget: ${budget || "N/A"}</p>
        <p>Property Type: ${propertyType || "N/A"}</p>
        <p>Timeline: ${timeline || "N/A"}</p>
        <p>We will notify you when the provider responds.</p>
        <p>Best regards,<br>Home Services Hub</p>
      `;
      break;
    case "completed":
      subject = `Service Request Completed: ${serviceName}`;
      html = `
        <p>Dear Customer,</p>
        <p>Your service request for <b>${serviceName}</b> has been marked as completed by <b>${
        providerName || "N/A"
      }</b>.</p>
        <p>Thank you for using Home Services Hub.</p>
        <p>Best regards,<br>Home Services Hub</p>
      `;
      break;
    case "rejected":
      subject = `Service Request Rejected: ${serviceName}`;
      html = `
        <p>Dear Customer,</p>
        <p>We regret to inform you that your service request for <b>${serviceName}</b> was rejected by <b>${
        providerName || "N/A"
      }</b>.</p>
        <p>You may try another provider or contact support for help.</p>
        <p>Best regards,<br>Home Services Hub</p>
      `;
      break;
    case "cancelled":
      subject = `Service Request Cancelled: ${serviceName}`;
      html = `
        <p>Dear Customer,</p>
        <p>Your service request for <b>${serviceName}</b> has been cancelled.</p>
        <p>If this was a mistake or you need further assistance, please contact support.</p>
        <p>Best regards,<br>Home Services Hub</p>
      `;
      break;
    default:
      subject = `Service Request Update: ${serviceName}`;
      html = `
        <p>Dear Customer,</p>
        <p>Your service request for <b>${serviceName}</b> has been updated. Status: <b>${status}</b>.</p>
        <p>Best regards,<br>Home Services Hub</p>
      `;
  }

  return sendEmail({ to: customerEmail, subject, html });
};

export const sendAdminNewRegistrationEmail = async ({
  type, // 'user' or 'provider'
  name,
  email,
  phone,
  location,
  companyName,
  companyEmail,
  services,
  serviceAreas,
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || gmailConfig.user;
  let subject = "";
  let html = "";

  if (type === "user") {
    subject = `New User Registered: ${name}`;
    html = `
      <h2>New User Registration</h2>
      <ul>
        <li><b>Name:</b> ${name}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>Phone:</b> ${phone || "N/A"}</li>
        <li><b>Location:</b> ${location || "N/A"}</li>
      </ul>
      <p>This is an automated notification from Home Services Hub.</p>
    `;
  } else if (type === "provider") {
    subject = `New Provider Registered: ${companyName}`;
    html = `
      <h2>New Provider Registration</h2>
      <ul>
        <li><b>Company Name:</b> ${companyName}</li>
        <li><b>Company Email:</b> ${companyEmail || "N/A"}</li>
        <li><b>Phone:</b> ${phone || "N/A"}</li>
        <li><b>Location:</b> ${location || "N/A"}</li>
        <li><b>Services:</b> ${
          (Array.isArray(services) ? services.join(", ") : services) || "N/A"
        }</li>
        <li><b>Service Areas:</b> ${
          (Array.isArray(serviceAreas)
            ? serviceAreas.join(", ")
            : serviceAreas) || "N/A"
        }</li>
      </ul>
      <p>This is an automated notification from Home Services Hub.</p>
    `;
  }

  return sendEmail({ to: adminEmail, subject, html });
};

export const sendUserRegistrationOtpEmail = async ({ to, otp }) => {
  const subject = "🔐 Verify Your Email - Home Services Hub";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🏠 Home Services Hub</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Your trusted service partner</p>
        </div>
        
        <h2 style="color: #1f2937; margin-bottom: 20px;">Email Verification Required</h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello there! 👋</p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thank you for joining Home Services Hub! To complete your registration and secure your account, please verify your email address using the OTP below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f3f4f6; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; display: inline-block;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Your Verification Code</p>
            <h1 style="margin: 10px 0 0 0; color: #2563eb; font-size: 32px; letter-spacing: 4px; font-weight: bold;">${otp}</h1>
          </div>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">⏰ <strong>Important:</strong> This OTP expires in 10 minutes for your security.</p>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Simply enter this code in the registration form to activate your account and start exploring our services.</p>
        
        <div style="background-color: #f9fafb; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">🔒 <strong>Security Note:</strong> If you didn't request this verification, please ignore this email. Your account remains secure.</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <div style="text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Need help? Contact our support team</p>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">📧 support@homeserviceshub.com | 📞 +91-XXX-XXX-XXXX</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2024 Home Services Hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({ to, subject, html });
};

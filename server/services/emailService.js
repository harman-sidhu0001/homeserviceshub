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
  const subject = "Confirm Your Registration - OTP Verification";
  const html = `
    <p>Dear User,</p>
    <p>Your OTP for confirming your registration is: <b>${otp}</b></p>
    <p>This OTP is valid for <b>10 minutes</b>. Please enter it in the registration form to complete your sign up.</p>
    <p>If you did not initiate this request, you can ignore this email.</p>
    <p>Best regards,<br>Home Services Hub</p>
  `;
  return sendEmail({ to, subject, html });
};

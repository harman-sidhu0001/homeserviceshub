import crypto from "crypto";

// Generates a 6-digit numeric OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generates a secure reset token (for email/phone links)
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

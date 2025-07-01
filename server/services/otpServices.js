import redis from "../config/redisClient.js";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = async (userId, otp, expiresInSec = 300) => {
  const key = `otp:${userId}`;
  await redis.set(key, otp, "EX", expiresInSec); // expires in 5 mins
};

export const verifyOTP = async (userId, inputOtp) => {
  const key = `otp:${userId}`;
  const storedOtp = await redis.get(key);

  if (!storedOtp) {
    throw new Error("OTP expired or invalid");
  }

  if (storedOtp !== inputOtp) {
    throw new Error("Incorrect OTP");
  }

  await redis.del(key); // one-time use
  return true;
};

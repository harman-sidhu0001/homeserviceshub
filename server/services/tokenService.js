import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/jwt.js";
import redis from "../config/redisClient.js";

// Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Verification
export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

//store refresh token in redis
export const storeRefreshToken = async (userId, token) => {
  await redis.set(`refreshToken:${userId}`, token, "EX", 60 * 60 * 24 * 90); // 90 days
};

//get refresh token from redis
export const getStoredRefreshToken = async (userId) =>
  await redis.get(`refreshToken:${userId}`);

//delete refresh token from redis
export const deleteRefreshToken = async (userId) =>
  await redis.del(`refreshToken:${userId}`);

//verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error };
  }
};

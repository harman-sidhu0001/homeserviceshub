import rateLimit from "express-rate-limit";
import redis from "../config/redisClient.js";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, try again later.",
});
// middleware/rateLimiter.js
export const rateLimitPerUser = (keyPrefix, limit, seconds) => {
  return async (req, res, next) => {
    // If admin, skip rate limiting
    if (req.user && req.user.accountType === "admin") {
      return next();
    }
    const userKey = req.user?.id || req.body?.userId || req.ip; // fallback to IP if user missing
    const key = `${keyPrefix}:${userKey}`;

    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, seconds);
    }

    if (count > limit) {
      return res
        .status(429)
        .json({ message: "Too many requests. Try again later." });
    }

    next();
  };
};

export const rateLimitPerIP = (keyPrefix, limit, seconds) => {
  return async (req, res, next) => {
    const key = `${keyPrefix}:${req.ip}`;

    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, seconds);
    }

    if (count > limit) {
      return res
        .status(429)
        .json({ message: "Too many requests from this IP. Try again later." });
    }

    next();
  };
};

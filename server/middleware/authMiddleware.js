// middleware/verifyCookieAuth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ACCESS_TOKEN_SECRET } from "../config/jwt.js";

export const authenticate = async (req, res, next) => {
  try {
    console.log("Auth middleware - Cookies received:", req.cookies);
    console.log("Auth middleware - Headers:", {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
    });

    const token = req.cookies?.token;
    if (!token) {
      console.log("Auth middleware - No token found in cookies");
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    console.log("Auth middleware - Token found, verifying...");
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("Auth middleware - User not found");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    console.log("Auth middleware - Authentication successful");
    req.user = user;
    req.authenticatedID = decoded.id;
    next();
  } catch (err) {
    console.log("Auth middleware - Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

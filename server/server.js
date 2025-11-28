import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import redis from "./config/redisClient.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { getCorsOptions } from "./config/corsConfig.js";
import { currentConfig } from "./config/environment.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import serviceRoute from "./routes/servicesRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

// Optional global rate limiter
import { rateLimitPerIP } from "./middleware/rateLimiter.js";

// Load .env
dotenv.config();

// DB Connection
connectDB();

const app = express();

// Middlewares
const corsOptions = getCorsOptions();
console.log("🔗 CORS Configuration:", {
  environment: process.env.NODE_ENV || "development",
  origins: corsOptions.origin,
  credentials: true,
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Optional global throttle: 200 requests / 10 mins per IP
app.use(rateLimitPerIP("global", 200, 600)); // 10 mins

// Redis check
redis.on("connect", () => {
  console.log("✅ Redis connected");
});
redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoute);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/health", healthRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Error Handler
app.use(errorHandler);

// Server Start
const PORT = currentConfig.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 CORS Origins Count: ${currentConfig.corsOrigins.length}`);
});

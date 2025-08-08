import express from "express";
import redis from "../config/redisClient.js";
import mongoose from "mongoose";
import { currentConfig } from "../config/environment.js";

const router = express.Router();

// Health check endpoint
router.get("/", async (req, res) => {
  try {
    const health = {
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        database: "unknown",
        redis: "unknown",
      },
    };

    // Check database connection
    try {
      const dbState = mongoose.connection.readyState;
      health.services.database = dbState === 1 ? "connected" : "disconnected";
    } catch (error) {
      health.services.database = "error";
    }

    // Check Redis connection
    try {
      await redis.ping();
      health.services.redis = "connected";
    } catch (error) {
      health.services.redis = "disconnected";
    }

    const allServicesHealthy = Object.values(health.services).every(
      (service) => service === "connected"
    );

    const statusCode = allServicesHealthy ? 200 : 503;
    health.status = allServicesHealthy ? "OK" : "DEGRADED";

    res.status(statusCode).json(health);
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Cookie debug endpoint
router.get("/debug-cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      "user-agent": req.headers["user-agent"],
    },
    environment: process.env.NODE_ENV || "development",
    corsOrigins: currentConfig.corsOrigins,
    railwayDomain: process.env.RAILWAY_DOMAIN,
    renderDomain: process.env.RENDER_DOMAIN,
  });
});

// Test cookie setting endpoint
router.post("/test-cookie", (req, res) => {
  const origin = req.headers.origin;
  const isProduction = process.env.NODE_ENV === "production";
  const isCrossDomain = origin && origin !== req.headers.host;

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "none",
    maxAge: 1000 * 60 * 5, // 5 minutes
  };

  // Don't set domain for Railway - let browser handle it

  res.cookie("testCookie", "testValue", cookieOptions);

  res.json({
    message: "Test cookie set",
    cookieOptions,
    origin,
    isProduction,
    isCrossDomain,
  });
});

// Simple test endpoint that requires authentication
router.get("/test-auth", (req, res) => {
  console.log("Test auth endpoint - Cookies:", req.cookies);
  console.log("Test auth endpoint - Headers:", req.headers);

  if (!req.cookies?.token) {
    return res.status(401).json({
      message: "No token found",
      cookies: req.cookies,
      headers: {
        origin: req.headers.origin,
        host: req.headers.host,
      },
    });
  }

  res.json({
    message: "Authentication successful",
    cookies: req.cookies,
  });
});

// Environment info endpoint (sanitized)
router.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    config: {
      port: currentConfig.port,
      corsOriginsCount: currentConfig.corsOrigins.length,
    },
    timestamp: new Date().toISOString(),
  });
});

// CORS test endpoint
router.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.headers.origin,
    allowedOrigins: currentConfig.corsOrigins,
    timestamp: new Date().toISOString(),
  });
});

export default router;

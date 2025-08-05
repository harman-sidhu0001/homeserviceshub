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
        scheduler: "unknown",
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

    // Check scheduler status
    try {
      const schedulerService = await import("../services/schedulerService.js");
      const status = schedulerService.default.getStatus();
      health.services.scheduler = status.isRunning ? "running" : "stopped";
    } catch (error) {
      health.services.scheduler = "error";
    }

    const allServicesHealthy = Object.values(health.services).every(
      (service) => service === "connected" || service === "running"
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

// Environment info endpoint (sanitized)
router.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    config: {
      port: currentConfig.port,
      corsOriginsCount: currentConfig.corsOrigins.length,
      enableScheduler: currentConfig.enableScheduler,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;

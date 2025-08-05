import express from "express";
import schedulerService from "../services/schedulerService.js";

const router = express.Router();

// Get scheduler status
router.get("/status", (req, res) => {
  try {
    const status = schedulerService.getStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get scheduler status",
      error: error.message,
    });
  }
});

// Start the scheduler
router.post("/start", (req, res) => {
  try {
    schedulerService.start();
    res.json({
      success: true,
      message: "Scheduler started successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to start scheduler",
      error: error.message,
    });
  }
});

// Stop the scheduler
router.post("/stop", (req, res) => {
  try {
    schedulerService.stop();
    res.json({
      success: true,
      message: "Scheduler stopped successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to stop scheduler",
      error: error.message,
    });
  }
});

// Update API endpoint
router.put("/endpoint", (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        message: "Endpoint URL is required",
      });
    }

    schedulerService.updateEndpoint(endpoint);
    res.json({
      success: true,
      message: "API endpoint updated successfully",
      data: { endpoint },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update endpoint",
      error: error.message,
    });
  }
});

// Manually trigger API hit
router.post("/hit", async (req, res) => {
  try {
    await schedulerService.hitAPI();
    res.json({
      success: true,
      message: "Manual API hit triggered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to trigger manual API hit",
      error: error.message,
    });
  }
});

export default router;

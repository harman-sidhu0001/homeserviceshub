import axios from "axios";

class SchedulerService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.apiEndpoint =
      process.env.SCHEDULER_API_ENDPOINT || "https://httpbin.org/get"; // Default endpoint for testing
  }

  // Start the scheduler
  start() {
    if (this.isRunning) {
      console.log("⚠️ Scheduler is already running");
      return;
    }

    console.log(
      "🚀 Starting API scheduler - hitting endpoint every 14 minutes"
    );
    this.isRunning = true;

    // Hit API immediately on start
    this.hitAPI();

    // Set interval for every 14 minutes (14 * 60 * 1000 = 840000 ms)
    this.intervalId = setInterval(() => {
      this.hitAPI();
    }, 14 * 60 * 1000);
  }

  // Stop the scheduler
  stop() {
    if (!this.isRunning) {
      console.log("⚠️ Scheduler is not running");
      return;
    }

    console.log("🛑 Stopping API scheduler");
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Hit the API endpoint
  async hitAPI() {
    try {
      const timestamp = new Date().toISOString();
      console.log(`📡 Hitting API at ${timestamp}`);

      const response = await axios.get(this.apiEndpoint, {
        timeout: 10000, // 10 second timeout
        headers: {
          "User-Agent": "HomeServicesHub-Scheduler/1.0",
          "X-Scheduled-Request": "true",
          "X-Timestamp": timestamp,
        },
      });

      console.log(`✅ API hit successful - Status: ${response.status}`);

      // Log response data if needed (optional)
      if (process.env.NODE_ENV === "development") {
        console.log("📊 Response data:", response.data);
      }
    } catch (error) {
      console.error("❌ API hit failed:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      apiEndpoint: this.apiEndpoint,
      nextHit: this.isRunning ? "Every 14 minutes" : "Not scheduled",
    };
  }

  // Update API endpoint
  updateEndpoint(newEndpoint) {
    this.apiEndpoint = newEndpoint;
    console.log(`🔄 Updated API endpoint to: ${newEndpoint}`);
  }
}

// Create singleton instance
const schedulerService = new SchedulerService();

export default schedulerService;

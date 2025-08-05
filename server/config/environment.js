// Environment configuration for the backend
export const config = {
  development: {
    port: process.env.PORT || 5000,
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:5173", "http://localhost:3000"],
    enableScheduler: process.env.ENABLE_SCHEDULER === "true",
  },
  production: {
    port: process.env.PORT || 5000,
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:5173"],
    enableScheduler: process.env.ENABLE_SCHEDULER === "true",
  },
  test: {
    port: process.env.PORT || 5001,
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:5173", "http://localhost:3000"],
    enableScheduler: process.env.ENABLE_SCHEDULER === "true",
  },
};

// Get current environment
export const getCurrentEnv = () => {
  return process.env.NODE_ENV || "development";
};

// Get config for current environment
export const getConfig = () => {
  const env = getCurrentEnv();
  return config[env] || config.development;
};

// Export current config
export const currentConfig = getConfig();

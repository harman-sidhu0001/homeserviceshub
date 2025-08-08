// Helper function to clean CORS origins
const cleanCorsOrigins = (originsString) => {
  if (!originsString) return [];
  return originsString
    .split(",")
    .map((origin) => origin.trim().replace(/['"]/g, ""))
    .filter((origin) => origin.length > 0);
};

// Environment configuration for the backend
export const config = {
  development: {
    port: process.env.PORT || 5000,
    corsOrigins: process.env.CORS_ORIGINS
      ? cleanCorsOrigins(process.env.CORS_ORIGINS)
      : ["http://localhost:5173", "http://localhost:3000"],
  },
  production: {
    port: process.env.PORT || 5000,
    corsOrigins: process.env.CORS_ORIGINS
      ? cleanCorsOrigins(process.env.CORS_ORIGINS)
      : [
          "https://www.homeserviceshub.in",
          "https://homeserviceshub.in",
          "https://homeserviceshub-eta.vercel.app",
        ],
  },
  test: {
    port: process.env.PORT || 5001,
    corsOrigins: process.env.CORS_ORIGINS
      ? cleanCorsOrigins(process.env.CORS_ORIGINS)
      : ["http://localhost:5173", "http://localhost:3000"],
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

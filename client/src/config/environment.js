// Environment configuration for the application
export const config = {
  development: {
    apiBaseURL: "http://localhost:5000/api",
    appName: "HomeServicesHub",
    appURL: "http://localhost:5173",
  },
  production: {
    apiBaseURL: "https://api.homeserviceshub.in/api",
    appName: "HomeServicesHub",
    appURL: "https://homeserviceshub.in" || "https://www.homeserviceshub.in",
  },
  test: {
    apiBaseURL: "http://localhost:5000/api",
    appName: "HomeServicesHub",
    appURL: "http://localhost:5173",
  },
};

// Get current environment
export const getCurrentEnv = () => {
  return import.meta.env.MODE || "development";
};

// Get config for current environment
export const getConfig = () => {
  const env = getCurrentEnv();
  return config[env] || config.development;
};

// Export current config
export const currentConfig = getConfig();

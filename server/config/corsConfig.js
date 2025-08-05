import { currentConfig } from "./environment.js";

// CORS configuration for different environments
const corsOptions = {
  development: {
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  },
  production: {
    origin: currentConfig.corsOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  },
  test: {
    origin: currentConfig.corsOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  },
};

// Get CORS options based on environment
export const getCorsOptions = () => {
  const env = process.env.NODE_ENV || "development";
  return corsOptions[env] || corsOptions.development;
};

// Validate origin function for additional security
export const validateOrigin = (origin, callback) => {
  const allowedOrigins = currentConfig.corsOrigins;

  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);

  if (allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};

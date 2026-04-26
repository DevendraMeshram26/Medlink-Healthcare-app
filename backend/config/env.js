require("dotenv").config();

/**
 * Centralized Configuration Module
 * Loads and validates all environment variables cleanly.
 * This prevents crashes later on by failing fast if a required variable is missing.
 */

const requiredVariables = ["PORT", "MONGO_URL"];

requiredVariables.forEach((variable) => {
  if (!process.env[variable]) {
    console.error(`[CRITICAL ERROR] Missing required environment variable: ${variable}`);
    process.exit(1);
  }
});

module.exports = {
  port: process.env.PORT || 6969,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET || "default_super_secret_key",
  cloudinary: {
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  },
  ai: {
    groqApiKey: process.env.GROQ_API_KEY,
  },
};

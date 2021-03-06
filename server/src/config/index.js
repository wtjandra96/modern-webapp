const dotenv = require("dotenv");

// Set the NODE_ENV to "development" by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "development") {
  const config = dotenv.config();
  if (config.error) {
    throw new Error("Couldn't find .env file");
  }
}

module.exports = {
  port: parseInt(process.env.PORT || "5000", 10),
  databaseURL: process.env.DATABASE_URI,
  jwtSecret: process.env.JWT_SECRET,
  logs: {
    level: process.env.LOG_LEVEL || "silly"
  },
  api: {
    prefix: "/api"
  },
  cx: process.env.CX || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || ""
};

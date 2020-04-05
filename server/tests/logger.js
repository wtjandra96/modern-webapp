const winston = require("winston");

const transport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.cli(),
    winston.format.splat()
  )
});

const logger = winston.createLogger({
  level: "debug",
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({ stac: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [transport]
});

module.exports = logger;

const winston = require("winston");
const config = require("../config");

const transports = [];
if (process.env.NODE_ENV !== "development") {
  transports.push(new winston.transports.Console());
} else {
  const transport = {
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.splat()
    )
  };

  transports.push(new winston.transports.Console(transport));
}


const logger = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({ stac: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports
});

module.exports = logger;

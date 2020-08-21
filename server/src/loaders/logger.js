const winston = require("winston");
const container = require("typedi").Container;
const config = require("../config");

const transports = [];
if (process.env.NODE_ENV === "development") {
  const transport = {
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
      }),
      winston.format.errors({ stack: true }),
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.cli()
    )
  };
  transports.push(new winston.transports.Console(transport));
} else {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.cli()
  ),
  transports
});

container.set("logger", logger);
logger.info("Logger injected into container");

module.exports = logger;

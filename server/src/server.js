const express = require("express");
const config = require("./config");
const logger = require("./loaders/logger");
const loaders = require("./loaders");

const startServer = async () => {
  const app = express();
  await loaders(app);
  app.listen(config.port, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }

    logger.info(`Server started on port ${config.port}`);
  });
};

startServer();

const express = require("express");
const config = require("./config");
const loaders = require("./loaders");
const logger = require("./loaders/logger");

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

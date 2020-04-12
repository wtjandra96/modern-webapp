const config = require("./config");
const { getApp, loadApp } = require("./app");
const logger = require("./loaders/logger");

const startServer = async () => {
  const app = getApp();
  await loadApp(app);
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

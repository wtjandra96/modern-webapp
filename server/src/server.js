const config = require("./config");
const app = require("./app");
const logger = require("./loaders/logger");

app.listen(config.port, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
    return;
  }

  logger.info(`Server started on port ${config.port}`);
});

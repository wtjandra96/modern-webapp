const container = require("typedi").Container;

const logger = require("./logger");

module.exports = ({ models }) => {
  try {
    models.forEach((model) => {
      container.set(model.name, model.model);
    });

    container.set("logger", logger);
    logger.info("Logger injected into container");
  } catch (err) {
    logger.error(`Error on dependency injector loader: ${err}`);
  }
};

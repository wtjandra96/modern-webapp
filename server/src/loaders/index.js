const expressLoader = require("./express");
const dependencyInjectorLoader = require("./dependencyInjector");
const mongooseLoader = require("./mongoose");
const logger = require("./logger");

const UserModel = require("../models/User");

module.exports = async (app) => {
  await mongooseLoader();
  logger.info("Database loaded and connected");

  const userModel = {
    name: "UserModel",
    model: UserModel
  };

  await dependencyInjectorLoader({ models: [userModel] });
  logger.info("Dependency injector loaded");

  await expressLoader(app);
  logger.info("Express loaded");
};

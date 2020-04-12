const expressLoader = require("./express");
const dependencyInjectorLoader = require("./dependencyInjector");
const mongooseLoader = require("./mongoose");
const logger = require("./logger");

const UserModel = require("../models/User");
const PostModel = require("../models/Post");
const CategoryModel = require("../models/Category");
const LabelModel = require("../models/Label");

module.exports = async (app) => {
  await mongooseLoader();
  logger.info("Database loaded and connected");

  const userModel = {
    name: "UserModel",
    model: UserModel
  };

  const categoryModel = {
    name: "CategoryModel",
    model: CategoryModel
  };

  const labelModel = {
    name: "LabelModel",
    model: LabelModel
  };

  const postModel = {
    name: "PostModel",
    model: PostModel
  };

  dependencyInjectorLoader({ models: [userModel, categoryModel, labelModel, postModel] });
  logger.info("Dependency injector loaded");

  expressLoader(app);
  logger.info("Express loaded");
};

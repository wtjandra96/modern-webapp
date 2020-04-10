const express = require("express");

const loaders = require("./loaders");


const getApp = async () => {
  const app = express();
  await loaders(app);

  return app;
};

module.exports = getApp;

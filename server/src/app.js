const express = require("express");

const loaders = require("./loaders");


const getApp = () => {
  const app = express();
  return app;
};

const loadApp = async (app) => {
  await loaders(app);
};

module.exports = { getApp, loadApp };

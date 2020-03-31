const express = require("express");
const config = require("../config");
const routes = require("../api");

module.exports = (app) => {
  app.get("/status", (req, res) => {
    res.status(200).send("Hello world!");
  });

  // Body parser that transforms raw string of req.body into JSON
  app.use(express.json({ extended: false }));

  // Load API routes
  app.use(config.api.prefix, routes());
};

const express = require("express");
const { isCelebrate } = require("celebrate");

const config = require("../config");
const routes = require("../api");
const logger = require("./logger");

module.exports = (app) => {
  app.get("/status", (req, res) => {
    res.status(200).send("Hello world!");
  });

  // Body parser that transforms raw string of req.body into JSON
  app.use(express.json({ extended: false }));

  // Load API routes
  app.use(config.api.prefix, routes());

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.name === "PayloadTooLargeError") {
      logger.error(`${err.name}: ${err.message} | ${new Date()}`);
      return res.status(400).json({ errors: [{ errorMessage: err.message }] });
    }

    if (isCelebrate(err)) {
      const errDetails = err.joi.details;
      const errors = [];
      let route = "";
      for (let i = 0; i < errDetails.length; i += 1) {
        const currentError = errDetails[i];
        const [errorRoute, errorMessage] = currentError.message.split(":");
        errors.push({ errorMessage });
        if (!route) {
          route = errorRoute;
        }
      }
      const errMsg = `${route}: ValidationError ${JSON.stringify(errors)} | ${new Date()}`;
      logger.error(errMsg);
      return res.status(400).json({ errors: errors || err });
    }
    logger.error(
      `${err.message} ${JSON.stringify(err.errors)} | ${err.date}`
    );

    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).json({ errors: errors || err });
  });
};

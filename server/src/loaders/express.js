const container = require("typedi").Container;
const express = require("express");
const { isCelebrate } = require("celebrate");

const config = require("../config");
const routes = require("../api");

module.exports = (app) => {
  const logger = container.get("logger");

  app.get("/api/status", (req, res) => {
    logger.info("/api/status OK");

    res.status(200).send("OK");
  });

  // Body parser that transforms raw string of req.body into JSON
  app.use(express.json({ extended: false }));

  // Load API routes
  app.use(config.api.prefix, routes());

  // If route not found (404)
  app.use((req, res, next) => {
    const err = new Error("Not found");
    err.httpStatusCode = 404;
    err.errors = [{ errorMessage: "404 Not Found" }];

    next(err);
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.name === "PayloadTooLargeError") {
      logger.error(`${err.name}: ${err.message}`);
      return res.status(400).json({ errors: [{ errorMessage: err.message }] });
    }

    if (isCelebrate(err)) {
      const errDetails = err.joi.details;
      const errors = {};
      for (let i = 0; i < errDetails.length; i += 1) {
        if (!(errDetails[i].path[0] in errors)) {
          errors[errDetails[i].path[0]] = [];
        }
        errors[errDetails[i].path[0]].push(errDetails[i].message);
      }

      const reqBody = req.body;
      if (req.body.password) {
        delete req.body.password;
      }

      const errBody = {
        status: 400,
        body: reqBody,
        query: req.query,
        params: req.params,
        errors
      };
      const errMsg = `${req.method} ${req.url}: ValidationError`;
      logger.error(`${errMsg} %o\n`, errBody);
      return res.status(400).json({ errors: errors || err });
    }

    const { httpStatusCode, errors } = err;
    const errBody = {
      status: httpStatusCode,
      body: req.body,
      query: req.query,
      params: req.params,
      errors: errors || err
    };
    const errMsg = `${req.method} ${req.url}: ${err.name}`;
    logger.error(`${errMsg} %o\n`, errBody);

    return res.status(httpStatusCode || 500).json({ errors: errors || err });
  });
};

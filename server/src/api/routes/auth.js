const container = require("typedi").Container;

const express = require("express");
const AuthService = require("../../services/auth");

const router = express.Router();

/**
 * @route  POST api/auth/register
 * @desc   Register a new User
 * @access Public
 * @returns {object} { msg: string }
 * @param   {string} username
 * @param   {string} password
 */
router.post("/register", async (req, res) => {
  const logger = container.get("logger");

  const { username, password } = req.body;

  try {
    const authServiceInstance = container.get(AuthService);
    const payload = await authServiceInstance.register(
      username,
      password
    );
    return res.status(201).send(payload);
  } catch (err) {
    logger.error(
      "api/auth/register",
      err.name,
      err.date,
      err.errors
    );
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

/**
 * @route  POST api/auth/login
 * @desc   Login User
 * @access Public
 * @returns {object} { msg: string, token: string }
 * @param   {string} username
 * @param   {string} password
 */
router.post("/login", async (req, res) => {
  const logger = container.get("logger");

  const { username, password } = req.body;

  try {
    const authServiceInstance = container.get(AuthService);
    const payload = await authServiceInstance.login(
      username,
      password
    );
    return res.status(200).send(payload);
  } catch (err) {
    logger.error("api/auth/login", err.name, err.date, err.errors);
    const { httpStatusCode, errors } = err;
    return res.status(httpStatusCode || 500).send(errors || err);
  }
});

module.exports = (app) => app.use("/auth", router);

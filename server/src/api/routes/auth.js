const container = require("typedi").Container;

const express = require("express");
const { celebrate, Joi } = require("celebrate");
const AuthService = require("../../services/auth");
const { isAuth } = require("../middlewares");

const router = express.Router();
const logger = container.get("logger");

const PREFIX = "/api/auth";

const CHANGE_PASSWORD_ROUTE = "/changePassword";
const REGISTER_ROUTE = "/register";
const LOGIN_ROUTE = "/login";

/**
 * @route  POST api/auth/changePassword
 * @desc   Register a new User
 * @access Public
 * @returns {object} { message: string }
 * @param   {string} oldPassword
 * @param   {string} newPassword
 */
router.post(CHANGE_PASSWORD_ROUTE, isAuth, celebrate({
  body: Joi.object().keys({
    // Old password must not be empty
    oldPassword: Joi.string().messages({ "string.base": "Old password must be of type string" })
      .required()
      .messages({ "string.empty": "Old password is required" }),

    // New password must contain:
    // - Only lower case and upper case characters, digits, and special characters (!@?+-.,)
    // - At least one lower case character
    // - At least one upper case character
    // - At least one digit
    // - At least one special character from the following (!@?+-)ee
    newPassword: Joi.string().messages({ "string.base": "New password must be of type string" })
      .required()
      .messages({ "string.empty": "New password is required" })
      .min(8)
      .message("New password length should be at least 8 characters")
      .max(100)
      .message("New password cannot be more than 100 characters")
      .pattern(/^[a-zA-Z0-9!@?+-.,]*$/)
      .message("New password can only contain alphanumeric characters and the following symbols (!@?+-.,)")
      .regex(/.*\d/)
      .message("New password needs at least one number")
      .regex(/.*[a-z]/)
      .message("New password needs at least one lower case character")
      .regex(/.*[A-Z]/)
      .message("New password needs at least one upper case character")
      .regex(/.*[!@?+-.,]/)
      .message("New password needs at least one of the following symbols (!@?+_.,)")

  })
}, { abortEarly: false }), async (req, res, next) => {
  logger.debug(PREFIX + CHANGE_PASSWORD_ROUTE);

  const { userId } = req;
  const { oldPassword, newPassword } = req.body;

  try {
    const authServiceInstance = container.get(AuthService);
    const payload = await authServiceInstance.changePassword(
      userId,
      oldPassword,
      newPassword
    );
    return res.status(201).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route  POST api/auth/register
 * @desc   Register a new User
 * @access Public
 * @returns {object} { message: string }
 * @param   {string} username
 * @param   {string} password
 */
router.post(REGISTER_ROUTE, celebrate({
  body: Joi.object().keys({
    // Username must only contain alphanumeric characters
    username: Joi.string().messages({ "string.base": "Username must be of type string" })
      .required()
      .messages({ "string.empty": "Username is required" })
      .max(20)
      .message("Username length must be between 1 and 20 characters")
      .pattern(/^[a-zA-Z0-9]*$/)
      .message("Username can only contain alphanumeric characters"),

    // Password must contain:
    // - Only lower case and upper case characters, digits, and special characters (!@?+-.,)
    // - At least one lower case character
    // - At least one upper case character
    // - At least one digit
    // - At least one special character from the following (!@?+-)ee
    password: Joi.string().messages({ "string.base": "Password must be of type string" })
      .required()
      .messages({ "string.empty": "Password is required" })
      .min(8)
      .message("Password length should be at least 8 characters")
      .max(100)
      .message("Password cannot be more than 100 characters")
      .pattern(/^[a-zA-Z0-9!@?+-.,]*$/)
      .message("Password can only contain alphanumeric characters and the following symbols (!@?+-.,)")
      .regex(/.*\d/)
      .message("Password needs at least one number")
      .regex(/.*[a-z]/)
      .message("Password needs at least one lower case character")
      .regex(/.*[A-Z]/)
      .message("Password needs at least one upper case character")
      .regex(/.*[!@?+-.,]/)
      .message("Password needs at least one of the following symbols (!@?+_.,)")

  })
}, { abortEarly: false }), async (req, res, next) => {
  logger.debug(PREFIX + REGISTER_ROUTE);

  const { username, password } = req.body;

  try {
    const authServiceInstance = container.get(AuthService);
    const payload = await authServiceInstance.register(
      username,
      password
    );
    return res.status(201).send(payload);
  } catch (err) {
    return next(err);
  }
});

/**
 * @route  POST api/auth/login
 * @desc   Login User
 * @access Public
   * @returns {object}
   * {
   *   message: string,
   *   token: string,
   *   user: {
   *     username: string
   *   }
   * }
 * @param   {string} username
 * @param   {string} password
 */
router.post(LOGIN_ROUTE, celebrate({
  body: Joi.object().keys({
    // Username must only contain alphanumeric characters
    username: Joi.string().messages({ "string.base": "Username must be of type string" })
      .required()
      .messages({ "string.empty": "Username is required" }),

    // Password must contain:
    // - Only lower case and upper case characters, digits, and special characters (!@?+-.,)
    // - At least one lower case character
    // - At least one upper case character
    // - At least one digit
    // - At least one special character from the following (!@?+-.,)ee
    password: Joi.string().messages({ "string.base": "Password must be of type string" })
      .required()
      .messages({ "string.empty": "Password is required" })
  })
}, { abortEarly: false }), async (req, res, next) => {
  logger.debug(PREFIX + LOGIN_ROUTE);

  const { username, password } = req.body;
  try {
    const authServiceInstance = container.get(AuthService);
    const payload = await authServiceInstance.login(
      username,
      password
    );
    return res.status(200).send(payload);
  } catch (err) {
    return next(err);
  }
});

module.exports = (app) => app.use("/auth", router);

const authRoute = module.exports;
authRoute.REGISTER_ROUTE = PREFIX + REGISTER_ROUTE;
authRoute.LOGIN_ROUTE = PREFIX + LOGIN_ROUTE;
authRoute.CHANGE_PASSWORD_ROUTE = PREFIX + CHANGE_PASSWORD_ROUTE;

const container = require("typedi").Container;

const express = require("express");
const { celebrate, Joi } = require("celebrate");
const AuthService = require("../../services/auth");

const router = express.Router();

const POST = "POST";
const PREFIX = "api/auth";

const REGISTER_ROUTE = "/register";
const LOGIN_ROUTE = "/login";

const FULL_REGISTER_ROUTE = `${POST} ${PREFIX}${REGISTER_ROUTE}`;
const FULL_LOGIN_ROUTE = `${POST} ${PREFIX}${LOGIN_ROUTE}`;

/**
 * @route  POST api/auth/register
 * @desc   Register a new User
 * @access Public
 * @returns {object} { errorMessage: string }
 * @param   {string} username
 * @param   {string} password
 */
router.post("/register", celebrate({
  body: Joi.object({
    // Username must only contain alphanumeric characters
    username: Joi.string().messages({ "string.base": `${FULL_REGISTER_ROUTE}: Username must be of type string` })
      .required()
      .messages({ "string.empty": `${FULL_REGISTER_ROUTE}: Username is required` })
      .max(20)
      .message(`${FULL_REGISTER_ROUTE}: Username length must be between 1 and 20 characters`)
      .pattern(/^[a-zA-Z0-9]*$/)
      .message(`${FULL_REGISTER_ROUTE}: Username can only contain alphanumeric characters`),

    // Password must contain:
    // - Only lower case and upper case characters, digits, and special characters (!@?+-.,)
    // - At least one lower case character
    // - At least one upper case character
    // - At least one digit
    // - At least one special character from the following (!@?+-)ee
    password: Joi.string().messages({ "string.base": `${FULL_REGISTER_ROUTE}: Password must be of type string` })
      .min(8)
      .message(`${FULL_REGISTER_ROUTE}: Password length should be at least 8 characters`)
      .max(100)
      .message(`${FULL_REGISTER_ROUTE}: Password cannot be more than 100 characters`)
      .pattern(/^[a-zA-Z0-9!@?+-.,]*$/)
      .message(`${FULL_REGISTER_ROUTE}: Password can only contain alphanumeric characters and the following symbols (!@?+-.,)`)
      .regex(/.*\d/)
      .message(`${FULL_REGISTER_ROUTE}: Password needs at least one number`)
      .regex(/.*[a-z]/)
      .message(`${FULL_REGISTER_ROUTE}: Password needs at least one lower case character`)
      .regex(/.*[A-Z]/)
      .message(`${FULL_REGISTER_ROUTE}: Password needs at least one upper case character`)
      .regex(/.*[!@?+-.,]/)
      .message(`${FULL_REGISTER_ROUTE}: Password needs at least one of the following symbols (!@?+_.,)`)

  })
}, { abortEarly: false }), async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const authServiceInstance = container.get(AuthService);
    const payload = await authServiceInstance.register(
      username,
      password
    );
    return res.status(201).send(payload);
  } catch (err) {
    err.message = `${FULL_REGISTER_ROUTE}: ${err.name}`;
    return next(err);
  }
});

/**
 * @route  POST api/auth/login
 * @desc   Login User
 * @access Public
 * @returns {object} { errorMessage: string, token: string }
 * @param   {string} username
 * @param   {string} password
 */
router.post("/login", celebrate({
  body: Joi.object({
    // Username must only contain alphanumeric characters
    username: Joi.string().messages({ "string.base": `${FULL_LOGIN_ROUTE}: Username must be of type string` })
      .required()
      .messages({ "string.empty": `${FULL_LOGIN_ROUTE}: Username is required` }),

    // Password must contain:
    // - Only lower case and upper case characters, digits, and special characters (!@?+-.,)
    // - At least one lower case character
    // - At least one upper case character
    // - At least one digit
    // - At least one special character from the following (!@?+-.,)ee
    password: Joi.string().messages({ "string.base": `${FULL_LOGIN_ROUTE}: Password must be of type string` })
      .required()
      .messages({ "string.empty": `${FULL_LOGIN_ROUTE}: Password is required` })
  })
}), async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const authServiceInstance = container.get(AuthService);
    const payload = await authServiceInstance.login(
      username,
      password
    );
    return res.status(200).send(payload);
  } catch (err) {
    err.message = `${FULL_LOGIN_ROUTE}: ${err.name}`;
    return next(err);
  }
});


module.exports = (app) => app.use("/auth", router);

const authRoute = module.exports;
authRoute.FULL_REGISTER_ROUTE = FULL_REGISTER_ROUTE;
authRoute.FULL_LOGIN_ROUTE = FULL_LOGIN_ROUTE;

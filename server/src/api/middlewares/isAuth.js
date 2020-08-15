const container = require("typedi").Container;

const jwt = require("jsonwebtoken");
const config = require("../../config");

const isAuth = (req, res, next) => {
  const logger = container.get("logger");
  const token = req.header("x-auth-token"); // Grab token from header

  // Check if token exists
  if (!token || typeof token !== "string") {
    return res.status(401).json({
      success: false,
      errorMessage: "Token not found. Authorization denied."
    });
  }

  try {
    // Check if token is valid
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, errorMessage: "Invalid token" });
      }

      if (typeof decoded.userId !== "string") {
        return res.status(401).json({ success: false, errorMessage: "Invalid token" });
      }

      req.userId = decoded.userId;
      return null;
    });
  } catch (err) {
    logger.error(err);
  }
  return next();
};

module.exports = isAuth;

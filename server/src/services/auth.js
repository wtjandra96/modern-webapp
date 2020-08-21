const jwt = require("jsonwebtoken");
const config = require("../config");
const ServiceError = require("../utils/errors/serviceError");

let logger = null;

class AuthService {
  constructor (container) {
    this.userModel = container.get("UserModel");
    logger = container.get("logger");
  }

  async changePassword (userId, oldPassword, newPassword) {
    logger.debug("Changing password");

    const { userModel } = this;
    const userRecord = await userModel.findById(userId);
    if (!userRecord) {
      throw new ServiceError(400, {
        username: ["Invalid user"]
      });
    }

    // Check if password is correct
    const passwordMatch = await userRecord.comparePassword(
      oldPassword,
      userRecord.password
    );
    if (!passwordMatch) {
      throw new ServiceError(400, {
        errorMessage: ["Old password is incorrect"]
      });
    }

    // Update password
    await userModel.findOneAndUpdate({
      _id: userId
    }, { $set: { password: newPassword } });

    const payload = {
      message: "Password updated!"
    };
    return payload;
  }

  /**
   * @desc    Register a new User
   * @access  Public
   * @returns {object} { message: string }
   * @param   {string} username
   * @param   {string} password
   */
  async register (username, password) {
    logger.debug("Registering User");

    const { userModel } = this;

    await userModel.create({
      username,
      password
    });

    const payload = {
      message: "Register success"
    };
    return payload;
  }

  /**
   * @desc    Login User
   * @access  Public
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
  async login (username, password) {
    logger.debug("Logging in User");

    const { userModel } = this;

    // Check if User exists
    const userRecord = await userModel.findOne({ username });
    if (!userRecord) {
      throw new ServiceError(400, {
        username: ["Invalid username/password combination"]
      });
    }

    // Check if password is correct
    const passwordMatch = await userRecord.comparePassword(
      password,
      userRecord.password
    );
    if (!passwordMatch) {
      throw new ServiceError(400, {
        username: ["Invalid username/password combination"]
      });
    }

    // Generate authentication token
    const jwtPayload = {
      userId: userRecord.id,
      role: userRecord.role
    };

    const jwtOptions = {
      expiresIn: "7d"
    };

    const token = jwt.sign(
      jwtPayload,
      config.jwtSecret,
      jwtOptions
    );

    const payload = {
      message: "Login success",
      token,
      user: {
        username: userRecord.username
      }
    };
    return payload;
  }
}

module.exports = AuthService;

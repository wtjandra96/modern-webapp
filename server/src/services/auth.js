const jwt = require("jsonwebtoken");
const config = require("../config");
const ServiceError = require("../utils/errors/serviceError");

class AuthService {
  constructor (container) {
    this.userModel = container.get("UserModel");
  }

  /**
   * @desc    Register a new User
   * @access  Public
   * @returns {object} { message: string }
   * @param   {string} username
   * @param   {string} password
   */
  async register (username, password) {
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
    const { userModel } = this;

    // Check if User exists
    const userRecord = await userModel.findOne({ username });
    if (!userRecord) {
      throw new ServiceError(400, {
        errorMessage: ["Invalid username/password combination"]
      });
    }

    // Check if password is correct
    const passwordMatch = await userRecord.comparePassword(
      password,
      userRecord.password
    );
    if (!passwordMatch) {
      throw new ServiceError(400, {
        errorMessage: ["Invalid username/password combination"]
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

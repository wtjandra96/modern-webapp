const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const MongoError = require("../utils/errors/mongoError");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

UserSchema.method("toJSON", function toJSON () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

UserSchema.pre("save", async function hashPassword (next) {
  const user = this;
  logger.debug("Hashing password");

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  return next();
});

// Mongoose error handling middleware
// Reference: https://mongoosejs.com/docs/middleware.html#error-handling-middleware
UserSchema.post("save", (error, doc, next) => {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new MongoError(400, { username: ["Username already exists"] }));
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = async (password1, password2) => {
  const passwordMatch = await bcrypt.compare(password1, password2);
  return passwordMatch;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;

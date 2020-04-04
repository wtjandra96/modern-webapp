const mongoose = require("mongoose");
const MongoError = require("../utils/errors/mongoError");

const { Schema } = mongoose;

const LabelSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      unique: false,
      index: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      unique: false,
      index: true
    },
    name: {
      type: String,
      unique: false,
      required: true
    },
    color: {
      type: String,
      default: "#d6d6d6"
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

LabelSchema.index({ name: 1, owner: 1, category: 1 }, { unique: true });

// Mongoose error handling middleware
// Reference: https://mongoosejs.com/docs/middleware.html#error-handling-middleware
LabelSchema.post("save", (error, doc, next) => {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new MongoError(400, [{ msg: "Label already exists" }]));
  } else {
    next();
  }
});

const Label = mongoose.model("label", LabelSchema);

module.exports = Label;
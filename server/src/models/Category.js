const mongoose = require("mongoose");
const MongoError = require("../utils/errors/mongoError");

const { Schema } = mongoose;
const CategorySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      unique: false,
      index: true
    },
    name: {
      type: String,
      required: true,
      unique: false
    },
    labels: {
      type: [Schema.Types.Mixed],
      default: [
        {
          name: "Red label (default)",
          color: "hsl(0, 90%, 50%)"
        },
        {
          name: "Yellow label (default)",
          color: "hsl(56, 90%, 50%)"
        },
        {
          name: "Green label (default)",
          color: "hsl(100, 90%, 50%)"
        },
        {
          name: "Cyan label (default)",
          color: "hsl(150, 90%, 50%)"
        },
        {
          name: "Blue label (default)",
          color: "hsl(200, 90%, 50%)"
        },
        {
          name: "Purple label (default)",
          color: "hsl(250, 90%, 50%)"
        }
      ]
    }
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, owner: 1 }, { unique: true });

// Mongoose error handling middleware
// Reference: https://mongoosejs.com/docs/middleware.html#error-handling-middleware
CategorySchema.post("save", (error, doc, next) => {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new MongoError(409, [{ msg: "Category already exists" }]));
  } else {
    next();
  }
});

const Category = mongoose.model("category", CategorySchema);

module.exports = Category;

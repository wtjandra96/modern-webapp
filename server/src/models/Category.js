const container = require("typedi").Container;
const mongoose = require("mongoose");
const MongoError = require("../utils/errors/mongoError");

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: false,
      index: true
    },
    name: {
      type: String,
      required: true,
      unique: false
    }
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, owner: 1 }, { unique: true });

// Create default labels after Category is created
CategorySchema.post("save", async (doc) => {
  const labelModel = container.get("LabelModel");
  await labelModel.insertMany([
    {
      owner: doc.owner,
      category: doc.id,
      name: "Red label (default)",
      color: "hsl(0, 90%, 50%)"
    },
    {
      owner: doc.owner,
      category: doc.id,
      name: "Yellow label (default)",
      color: "hsl(56, 90%, 50%)"
    },
    {
      owner: doc.owner,
      category: doc.id,
      name: "Green label (default)",
      color: "hsl(100, 90%, 50%)"
    },
    {
      owner: doc.owner,
      category: doc.id,
      name: "Cyan label (default)",
      color: "hsl(150, 90%, 50%)"
    },
    {
      owner: doc.owner,
      category: doc.id,
      name: "Blue label (default)",
      color: "hsl(200, 90%, 50%)"
    },
    {
      owner: doc.owner,
      category: doc.id,
      name: "Purple label (default)",
      color: "hsl(250, 90%, 50%)"
    }
  ]);
});

// Mongoose error handling middleware
// Reference: https://mongoosejs.com/docs/middleware.html#error-handling-middleware
CategorySchema.post("save", async (error, doc, next) => {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new MongoError(400, [{ msg: "Category already exists" }]));
  } else {
    next();
  }
});

const Category = mongoose.model("category", CategorySchema);

module.exports = Category;

const mongoose = require("mongoose");

const { Schema } = mongoose;
const PostSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users"
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "categories"
    },
    labels: {
      type: [Schema.Types.ObjectID],
      ref: "labels",
      default: []
    },
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    originalDate: {
      type: Date,
      default: new Date()
    },
    imgSrc: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

PostSchema.index({ owner: 1, category: 1, labels: 1 });

const Post = mongoose.model("post", PostSchema);

module.exports = Post;

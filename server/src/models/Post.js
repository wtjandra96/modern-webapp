/* eslint-disable prefer-destructuring */
const mongoose = require("mongoose");

function extractHostname (url) {
  let hostname;

  // http prefix
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  // Remove port number
  hostname = hostname.split(":")[0];
  // Remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}

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
      ref: "category"
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
    source: {
      type: String,
      default: null
    },
    imgSrc: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

PostSchema.index({ owner: 1, category: 1, labels: 1 });

// Mongoose error handling middleware
// Reference: https://mongoosejs.com/docs/middleware.html#error-handling-middleware
PostSchema.pre("save", function addSource (next) {
  const post = this;
  const { url } = post;
  post.source = extractHostname(url);
  console.log("source is ", post.source, " from ", url);
  return next();
});
PostSchema.pre("findOneAndUpdate", function addSource (next) {
  const post = this;
  const { _update } = post;
  _update.source = extractHostname(_update.url);
  return next();
});
PostSchema.method("toJSON", function toJSON () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;

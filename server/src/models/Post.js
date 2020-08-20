/* eslint-disable prefer-destructuring */
const mongoose = require("mongoose");
const axios = require("axios");
const config = require("../config");

const extractHostname = (url) => {
  let hostname;

  // http prefix
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  // Remove port number and ?
  hostname = hostname.split(":")[0]
    .split("?")[0];
  return hostname;
}

const getImgSrc = async (hostname) => {
  if (process.env.NODE_ENV === "test") return null;
  let topic;
  topic = hostname.split(".");
  if (topic.length > 2) {
    topic = topic[1];
  } else {
    topic = topic[0];
  }

  let searchTerm = topic + " icon";
  try {
    const res = await axios.get(
      "https://customsearch.googleapis.com/customsearch/v1", {
      params: {
        q: searchTerm,
        cx: config.cx,
        key: config.GOOGLE_API_KEY,
        searchType: "image"
      }
    })
    let items = res.data.items;
    
    if (!items) return null;
    let pickedItem = null;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      console.log(item.image, item.link);
      let width = item.image.width;
      let height = item.image.height;
      if (width !== height) continue;
      pickedItem = item;
    }
    if (pickedItem) {
      return pickedItem.link;
    }
    if (!pickedItem && items && items.length > 0) {
      return items[0].link;
    }
    return null;
  } catch (err) {
    // return null if error
    return null;
  }
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
    },
    isBookmarked: {
      type: Boolean,
      default: false
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
PostSchema.pre("save", async function addSource (next) {
  const post = this;
  const { url } = post;
  const hostname = extractHostname(url);
  post.source = hostname;
  const imgSrc = await getImgSrc(hostname);
  post.imgSrc = imgSrc;
  return next();
});
PostSchema.pre("findOneAndUpdate", async function addSource (next) {
  const post = this;
  const { _update } = post;
  if (_update.url) {
    const hostname = extractHostname(_update.url);
    _update.source = hostname;
    const imgSrc = await getImgSrc(hostname);
    _update.imgSrc = imgSrc;
  }
  return next();
});
PostSchema.method("toJSON", function toJSON () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;

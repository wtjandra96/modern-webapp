const router = require("express").Router;

const auth = require("./routes/auth");
const categories = require("./routes/categories");
const posts = require("./routes/posts");

module.exports = () => {
  const app = router();
  auth(app);
  categories(app);
  posts(app);

  return app;
};

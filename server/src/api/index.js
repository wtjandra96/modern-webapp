const router = require("express").Router;

const auth = require("./routes/auth");

module.exports = () => {
  const app = router();
  auth(app);

  return app;
};

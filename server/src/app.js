const express = require("express");

const loaders = require("./loaders");

const app = express();

loaders(app);

// Init Middleware

// app.use("/api/auth", authRoute);

module.exports = app;

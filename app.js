const express = require("express");
const app = express();
const { fetchObject } = require("./controller.js");

app.get("/api", fetchObject);

module.exports = app;

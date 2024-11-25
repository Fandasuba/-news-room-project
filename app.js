const express = require("express");
const app = express();
const { fetchObject, fetchTopics } = require("./controller.js");

app.get("/api", fetchObject);

app.get("/api/topics", fetchTopics);

app.use((req, res, next) => {
  res.status(404).send("404 - Page Not Found");
  next();
});

app.use((req, res, next) => {
  res.status(500).send("500 - Internal server error");
});

module.exports = app;

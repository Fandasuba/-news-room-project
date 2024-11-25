const express = require("express");
const app = express();
const { fetchObject, fetchTopics } = require("./controller.js");

app.get("/api", fetchObject);

app.get("/api/topics", fetchTopics);

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

module.exports = app;

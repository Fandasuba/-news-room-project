const express = require("express");
const app = express();
const { fetchObject, fetchTopics, fetchArticles } = require("./controller.js");

app.get("/api", fetchObject);

app.get("/api/topics", fetchTopics);

app.get("/api/articles/:article_id", fetchArticles);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;

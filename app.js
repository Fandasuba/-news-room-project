const express = require("express");
const app = express();
const {
  fetchObject,
  fetchTopics,
  fetchArticlesId,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("./controller.js");

app.get("/api", fetchObject);

app.get("/api/topics", fetchTopics);

app.get("/api/articles/:article_id", fetchArticlesId);

app.get("/api/articles", fetchArticles);

app.get("/api/articles/:article_id/comments", fetchCommentsByArticleId);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;

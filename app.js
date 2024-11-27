const express = require("express");
const app = express();
const {
  fetchObject,
  fetchTopics,
  fetchArticlesId,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("./MCV/get/controller.js");
const { postNewComments } = require("./MCV/POST/post-controller.js");

app.use(express.json());

app.get("/api", fetchObject);

app.get("/api/topics", fetchTopics);

app.get("/api/articles/:article_id", fetchArticlesId);

app.get("/api/articles", fetchArticles);

app.get("/api/articles/:article_id/comments", fetchCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postNewComments);

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid inputs in table post." });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid data type in endpoint" });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;

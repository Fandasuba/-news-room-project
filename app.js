const cors = require("cors");

const express = require("express");
const app = express();
const {
  fetchObject,
  fetchTopics,
  fetchArticlesId,
  fetchArticles,
  fetchCommentsByArticleId,
  fetchUsers,
} = require("./MCV/get/controller.js");

app.use(cors());
const { postNewComments } = require("./MCV/POST/post-controller.js");
const { patchArticles } = require("./MCV/patch/patch-controller.js");
const { deleteComments } = require("./MCV/DELETE/delete-controller.js");

app.use(express.json());

app.get("/api", fetchObject);

app.get("/api/topics", fetchTopics);

app.get("/api/articles/:article_id", fetchArticlesId);

app.get("/api/articles", fetchArticles);

app.get("/api/articles/:article_id/comments", fetchCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postNewComments);

app.patch("/api/articles/:article_id", patchArticles);

app.delete("/api/comments/:comment_id", deleteComments);

app.get("/api/users", fetchUsers);

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid input for POST/PATCH." });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid data type in endpoint" });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404 - invalid url endpoint." });
});
module.exports = app;

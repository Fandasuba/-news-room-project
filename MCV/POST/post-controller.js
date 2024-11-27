const comments = require("../../db/data/test-data/comments");
const { parseNewComment } = require("../POST/post-model");
const { getArticlesById } = require("../get/model");

exports.postNewComments = (req, res, next) => {
  // console.log("IN Controller");
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (isNaN(Number(article_id))) {
    return next({
      status: 400,
      msg: "Invalid ID, please use a number ID rather than a string.",
    });
  }
  if (!username || !body) {
    return next({
      status: 400,
      msg: "Invalid request: Missing username and/or body",
    });
  }
  getArticlesById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      // console.log("Running through getArticles by ID in controller");
      return parseNewComment({ author: username, body }, article_id);
    })
    .then((insertedComment) => {
      res.status(201).send({ comment: insertedComment });
    })
    .catch((err) => {
      // console.error("Error in postNewComments:", err);
      next(err);
    });
};

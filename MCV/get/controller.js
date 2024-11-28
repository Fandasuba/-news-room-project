const {
  getTopics,
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
  getUsers,
} = require("./model");
const endpointJson = require("../../endpoints.json");

exports.fetchObject = (req, res) => {
  res.status(200).send({ endpoints: endpointJson });
};

exports.fetchTopics = (req, res) => {
  getTopics().then((rows) => {
    res.status(200).send({ topics: rows });
  });
};

exports.fetchArticlesId = (req, res, next) => {
  const { article_id } = req.params;
  getArticlesById(article_id)
    .then((row) => {
      res.status(200).send({ article: row });
    })
    .catch((err) => {
      if (err.status === 404) {
        return res.status(404).send({ msg: "Article not found" });
      }
      next(err);
    });
};

exports.fetchArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  getAllArticles(sort_by, order)
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch(next);
};

exports.fetchCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  getCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      if (err.status === 404) {
        return res.status(404).send({ msg: "Article not found" });
      }
      next(err);
    });
};

exports.fetchUsers = (req, res, next) => {
  // console.log("IN FETCH USERS");
  getUsers()
    .then((rows) => {
      res.status(200).send({ users: rows });
    })
    .catch((err) => {
      if ((err.status = 404)) {
        return res.status(404).send({ msg: "Users not found" });
      }
      next(err);
    });
};

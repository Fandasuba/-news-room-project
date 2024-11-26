const { getTopics, getArticlesById, getAllArticles } = require("./model");
const endpointJson = require("./endpoints.json");

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
  getAllArticles()
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(404).send({ msg: "No articles found" });
      }
      res.status(200).send({ articles: rows });
    })
    .catch(next);
};

const { getTopics, getArticles } = require("./model");
const endpointJson = require("./endpoints.json");
const db = require("./db/connection");

exports.fetchObject = (req, res) => {
  res.status(200).send({ endpoints: endpointJson });
};

exports.fetchTopics = (req, res) => {
  getTopics().then((rows) => {
    res.status(200).send({ topics: rows });
  });
};

exports.fetchArticles = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id, "INSIDE CONTROLLER");
  getArticles(article_id)
    .then((rows) => {
      console.log(rows, "BIG ROW");
      res.status(200).send({ article: rows });
    })
    .catch(next);
};

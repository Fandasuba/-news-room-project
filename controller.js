const { getTopics } = require("./model");
const endpointJson = require("./endpoints.json");
const db = require("./db/connection");

exports.fetchObject = (req, res) => {
  res.status(200).send({ endpoints: endpointJson });
};

exports.fetchTopics = (req, res) => {
  getTopics().then((rows) => {
    res.status(200).send(rows);
    console.log(rows);
  });
};

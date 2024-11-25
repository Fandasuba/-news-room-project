const {} = require("./model");
const endpointJson = require("./endpoints.json");
const db = require("./db/connection");

exports.fetchObject = (req, res) => {
  res.status(200).send({ endpoints: endpointJson });
};

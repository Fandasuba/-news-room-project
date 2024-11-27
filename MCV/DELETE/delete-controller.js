const { deleteCommentsById } = require("../DELETE/delete-model");

exports.deleteComments = (req, res, next) => {
  //console.log(req.params);
  const { comment_id } = req.params;
  //console.log(comment_id, "checking PARAMS");

  deleteCommentsById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

/// use DELETE  to remove a row from the table. Need to remove comment via its ID. responds with 204 and no content.
